const express = require("express");
const {createProduct,getAllAuction,getAuction,updateAuction,deleteAuction,getProductsByUserId,getImage,getDocs} = require('../controllers/sellerProductController')
const { verifyAdmin, verifyUser } = require('../middleware/verifyToken')
const upload = require('../middleware/upload');
// const company_route = express();
const router = express.Router();
router.post('/create',verifyAdmin,upload, createProduct);
router.get('/', verifyAdmin, getAllAuction);
router.get('/:id', verifyUser, getAuction);
router.put('/:id', verifyAdmin,upload, updateAuction);
router.delete('/:id', verifyAdmin, deleteAuction);
router.get('/proUser/:userId', getProductsByUserId);
router.get('/uploadDocuments/:filename', getImage); 
router.get('/essentialDocs/:filename', getDocs);
// router.post('/createproduct', upload.single('uploadDocuments'), createProduct); 





module.exports = router;