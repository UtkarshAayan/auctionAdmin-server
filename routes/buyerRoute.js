const express = require("express");
const router = express.Router();
const {getAllBuyer}=require('../controllers/buyerController')

router.get('/getAllBuyer', getAllBuyer);

module.exports = router;