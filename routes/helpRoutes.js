const express = require('express');
const router = express.Router();
const helpContentController = require('../controllers/helpController');


router.post('/content', helpContentController.createHelpContent);
router.get('/contents', helpContentController.getAllHelpContent);
router.put('/content/:id', helpContentController.updateHelpContent);  
router.delete('/content/:id', helpContentController.deleteHelpContent); 


module.exports = router;
