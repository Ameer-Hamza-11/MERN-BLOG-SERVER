    const User = require('../Models/user-model');
    const Blog = require('../Models/blog-model');


    const getAllUsers = async (req, res, next) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const totalUsers = await User.countDocuments();
            const totalPages = Math.ceil(totalUsers / limit);

            const users = await User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 });

            if (!users.length) {
                return res.status(404).json({ message: 'No users found' });
            }

            return res.status(200).json({ users, currentPage: page, totalPages, totalUsers });
        } catch (error) {
            next(error);
        }
    };

    const getUsersBy = async (req, res, next) => {
        try {
            const id = req.params.id
            if (!id) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const user = await User.findById(id).select('-password')
            if (!user) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            return res.status(200).json({ user })
        } catch (error) {
            next(error);

        }
    }


    const deleteUser = async (req, res, next) => {
        try {
            const deleted = await User.findByIdAndDelete(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'User not found' });

            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    const updateUser = async (req, res, next) => {
        try {
            const updated = await User.findByIdAndUpdate(
                req.params.id,
                { ...req.body },
                { new: true, runValidators: true }
            ).select('-password');

            if (!updated) return res.status(404).json({ message: 'User not found' });

            return res.status(200).json({ message: 'User updated', user: updated });
        } catch (error) {
            next(error);
        }
    };

    const getAllBlogs = async (req, res, next) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const totalBlogs = await Blog.countDocuments();
            const totalPages = Math.ceil(totalBlogs / limit);

            const blogs = await Blog.find()
                .populate('author', 'username email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            if (!blogs.length) {
                return res.status(404).json({ message: 'No blogs found' });
            }

            return res.status(200).json({ blogs, currentPage: page, totalPages, totalBlogs });
        } catch (error) {
            next(error);
        }
    };

    const deleteBlog = async (req, res, next) => {
        try {
            const deleted = await Blog.findByIdAndDelete(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Blog not found' });

            return res.status(200).json({ message: 'Blog deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    const updateBlog = async (req, res, next) => {
        try {
            const updated = await Blog.findByIdAndUpdate(
                req.params.id,
                { ...req.body },
                { new: true, runValidators: true }
            );

            if (!updated) return res.status(404).json({ message: 'Blog not found' });

            return res.status(200).json({ message: 'Blog updated successfully', blog: updated });
        } catch (error) {
            next(error);
        }
    };

    module.exports = {
        getAllUsers,
        getUsersBy,
        deleteUser,
        updateUser,
        getAllBlogs,
        deleteBlog,
        updateBlog
    };
