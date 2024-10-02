const express = require("express");
const User = require('../models/userModel');
const { getAllUsers, getUser,deleteUser,updateUser,register,verifyProductByAdmin,getAllSellers,getAllBuyers,getAllSubAdmins } = require('../controllers/userController')
const { verifyAdmin, verifyUser } = require('../middleware/verifyToken')
// const company_route = express();
const router = express.Router();
router.get('/', verifyAdmin, getAllUsers);
router.get('/sellers', verifyAdmin, getAllSellers);
router.get('/buyers', verifyAdmin, getAllBuyers);
router.get('/subadmins', verifyAdmin, getAllSubAdmins);
router.get('/:id', verifyUser, getUser);
router.put('/:id', verifyAdmin, updateUser);
router.delete('/:id', verifyAdmin, deleteUser);
router.post('/register', register);
router.put('/proVerify/:id', verifyProductByAdmin);
module.exports = router;