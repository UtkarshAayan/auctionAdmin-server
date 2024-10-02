const express = require('express');
const { verifyProductByAdmin,verifyUserByAdmin } = require('../controllers/adminController');
const router = express.Router();

router.post('/verify-product/:id', verifyProductByAdmin);
router.put('/verify/:id', verifyUserByAdmin);
module.exports = router;
