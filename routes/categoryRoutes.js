const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const upload = require('../middleware/upload'); 

router.post('/create',upload, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.put('/:id', upload,categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.delete('/:categoryId/subcategories/:subcategoryId', categoryController.deleteSubcategory);
module.exports = router;
