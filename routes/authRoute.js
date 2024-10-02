const express = require('express');
const {login,registerAdmin,sendEmail,resetPassword,signup,registerSeller,registerBuyer,registerSubadmin} = require('../controllers/authController')

//as User
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
//as Admin
router.post('/register-admin', registerAdmin);
//as Seller
router.post('/register-seller', registerSeller);
//as Buyer
router.post('/register-buyer', registerBuyer);
//subadmin
router.post('/register-subadmin', registerSubadmin);
//send reset email

router.post('/send-email',sendEmail)

//Reset Password
router.post("/resetPassword", resetPassword);

module.exports = router;