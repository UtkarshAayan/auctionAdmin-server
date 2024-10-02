const express = require('express');
const router = express.Router();
const aboutUsController = require('../controllers/aboutUsController');

router.post('/create', aboutUsController.createAbout);

router.get('/', aboutUsController.getAbout);

router.put('/:id', aboutUsController.updateAbout);

router.delete('/:id', aboutUsController.deleteAbout);

module.exports = router;
