const express = require('express');
const router = express.Router();

const verifyToken = require('../Middlewares/verifyToken');
const adminMiddleware = require('../Middlewares/admin-middleware');
const admin = require('../Controllers/admin-controller');


router.use(verifyToken, adminMiddleware);

// 👥 User routes
router.get('/users', admin.getAllUsers);           // Get all users with pagination
router.get('/users/:id', admin.getUsersBy);           // Get all users with pagination
router.delete('/users/:id', admin.deleteUser);     // Delete user by ID
router.patch('/users/:id', admin.updateUser);        // Update user by ID


router.get('/blogs', admin.getAllBlogs);           // Get all blogs with pagination
router.delete('/blogs/:id', admin.deleteBlog);     // Delete blog by ID
router.patch('/blogs/:id', admin.updateBlog);        // Update blog by ID

module.exports = router;
