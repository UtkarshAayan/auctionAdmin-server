const express = require("express");
const Role = require('../models/roleModel');
const {createDropdown,getAllDropdowns} = require('../controllers/dropDownController')
const { verifyAdmin, verifyUser } = require('../middleware/verifyToken')
// const company_route = express();
const router = express.Router();
router.post('/create',verifyAdmin, createDropdown);
router.get('/getAll',verifyAdmin, getAllDropdowns);
module.exports = router;