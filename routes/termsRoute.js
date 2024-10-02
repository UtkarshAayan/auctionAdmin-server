const express = require('express');
const router = express.Router();
const termsController = require('../controllers/termsController');

router.post('/create', termsController.createTerms);

router.get('/', termsController.getTerms);

router.put('/:id', termsController.updateTerms);

router.delete('/:id', termsController.deleteTerms);

module.exports = router;
