// routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadBanner, getBannerImages,deleteBannerImage } = require('../controllers/homeBannerImageController');

// POST /api/banner/upload - Upload up to 3 banner images
router.post('/upload', upload, uploadBanner);

// GET /api/banner/view - Get the banner images
router.get('/view', getBannerImages);
router.delete('/delete/:imageUrl', deleteBannerImage);
module.exports = router;
