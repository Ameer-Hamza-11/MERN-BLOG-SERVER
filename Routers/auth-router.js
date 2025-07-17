const express = require('express');
const router = express.Router()
const auth_controller = require('../Controllers/auth-controller');
const verifyToken = require('../Middlewares/verifyToken');
const upload = require('../Middlewares/multer-middleware');

router.route('/register').post(auth_controller.register)
router.route('/login').post(auth_controller.login)
router.route('/user/:id').get(verifyToken, auth_controller.getUserById)


router.route('/profile').get(verifyToken, auth_controller.getProfile)
router.route('/profile/edit').patch(verifyToken, upload.single('avatar'), auth_controller.updateProfile)


router.route('/profile/change-password').patch(verifyToken, auth_controller.changePassword)


module.exports = router