const User = require('../Models/user-model');
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Unauthorized Access' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Unauthorized Access' });
    }
    try {
        const isVerified = jwt.verify(token, process.env.JWT_SECRET);
        const userData = await User.findOne({ email: isVerified.email }).select({ password: 0 })
        console.log('User Data:', userData);

        req.user = {
            userId: userData.id,
            email: userData.email,
            isAdmin: userData.isAdmin
        };

        next()


    } catch (error) {
        return res.status(401).json({ message: 'Invalid or Expired Token' });
    }


}
module.exports = verifyToken;