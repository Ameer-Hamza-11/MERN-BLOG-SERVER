const User = require('../Models/user-model')

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(409).json({ message: 'User Already Exist' });
        }
        const newUser = new User({ username, email, password })
        await newUser.save()

        const token = await newUser.generateToken()
        return res.status(200).json({
            message: 'User Registered',
            token,
            id: newUser._id.toString()
        })


    } catch (error) {
        next(error)
    }
}


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const isUserExist = await User.findOne({ email })
        if (!isUserExist) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const isMatch = await isUserExist.comparePassword(password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const token = await isUserExist.generateToken()
        return res.status(200).json({
            message: 'Login SuccessFull',
            token,
            id: isUserExist._id.toString()
        })
    } catch (error) {
        next(error)
    }
}

const getProfile = async (req, res, next) => {
    try {
        const profile = await User.findById(req.user.userId).select({ password: 0 })
        if (!profile) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        return res.status(200).json({
            message: 'User profile',
            profile
        })
    } catch (error) {
        next(error)
    }
}


const updateProfile = async (req, res, next) => {
    try {
        const { bio, website, location } = req.body;
        const avatar = req.file?.filename;
        const updateData = { bio, website, location };
        if (avatar) updateData.avatar = avatar;
        const updatedProfile = await User.findByIdAndUpdate(req.user.userId, { $set: updateData }, { new: true }).select({ password: 0 });
        if (!updatedProfile) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        return res.status(200).json({
            message: 'Profile Updated Successfully',
            updatedProfile
        })

    } catch (error) {
        next(error)
    }
}


const getProfileById = async (req, res, next) => {
    try {
        const id = req.params.id
        const profile = await User.findById(id).select('username email bio avatar website location createdAt');
        if (!profile) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        return res.status(200).json({
            message: 'User Profile',
            profile
        });
    } catch (error) {
        next(error)
    }
}



const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old Password is Incorrect' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New Password and Confirm Password do not match' });
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({
            message: 'Password Changed Successfully'
        });
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('username email bio avatar website location createdAt');
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        return res.status(200).json({
            message: 'User Profile Retrieved Successfully',
            user
        });

    } catch (error) {
        next(error)

    }
}


module.exports = { register, login, getProfile, updateProfile, getProfileById, changePassword, getUserById }