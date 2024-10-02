// middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Store files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename the file with a timestamp to avoid conflicts
  }
});

const upload = multer({
  storage: storage,
}).fields([
  { name: 'uploadDocuments', maxCount: 3 },   // For other document uploads
  { name: 'essentialDocs', maxCount: 3 },     // For essential documents
  { name: 'categoryImage', maxCount: 1 },     // For category image
  { name: 'subcategoryImage', maxCount: 5 },  // For multiple subcategory images
  { name: 'bannerImages', maxCount: 3 },       // For banner image upload
]);

module.exports = upload;
