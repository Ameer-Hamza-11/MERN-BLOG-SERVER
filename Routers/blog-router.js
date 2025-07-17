const express = require('express');
const router = express.Router();
const blog_controller = require('../Controllers/blog-controller');
const verifyToken = require('../Middlewares/verifyToken');
const upload = require('../Middlewares/multer-middleware');



router.route('/').post(verifyToken, upload.single('thumbnail'), blog_controller.postBlog)
router.route('/').get(blog_controller.getBlogs)
router.route('/userBlogs').get(verifyToken, blog_controller.getBlogOfAuther)
router.route('/:id').get(verifyToken, blog_controller.getBlogById)
router.route('/delete/:id').delete(verifyToken, blog_controller.deleteBlogById)
router.route('/update/:id').patch(verifyToken, upload.single('thumbnail'), blog_controller.updateBlogById)




module.exports = router;