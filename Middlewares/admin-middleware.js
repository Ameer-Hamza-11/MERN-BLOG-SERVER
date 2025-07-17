const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        next()
    } catch (error) {
        console.error('Admin Middleware Error:', error.message);
        res.status(500).json({ message: 'Server error in admin middleware' });
    }
}


module.exports = adminMiddleware