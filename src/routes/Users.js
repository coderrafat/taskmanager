const { OTPVerify } = require('../helpers/VerifyOTP');
const { register, login, profile, users, resetPassword, updateProfile, updatePassword } = require('../controllers/UsersController');
const { isLogin, isAdmin } = require('../middlewares/auth');

const router = require('express').Router();



//User Register route
router.post('/register', register);

//User Login route
router.get('/login', login);

//User Profile route
router.get('/user/profile', isLogin, profile);

//Update User Profile Route
router.post('/user/profile-update', isLogin, updateProfile);

//Update User Password Route
router.put('/user/update-password', isLogin, updatePassword);

//Admin route
router.get('/users', isLogin, isAdmin, users);




//RECOVER PASSWORD

//Verify OTP
router.get('/verify-otp', OTPVerify);

//Reset Password After Verify OTP
router.put('/reset-password', resetPassword);


module.exports = router;