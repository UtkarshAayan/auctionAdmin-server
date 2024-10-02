const express = require('express');
const router = express.Router();
const helpController = require('../controllers/helpController');

// Create new "How to Sell" content
router.post('/how-to-sell', helpController.createHowToSellContent);

// Get all "How to Sell" content
router.get('/how-to-sell', helpController.getHowToSellContents);

// Update "How to Sell" content by ID
router.put('/how-to-sell/:id', helpController.updateHowToSellContent);

// Delete "How to Sell" content by ID
router.delete('/how-to-sell/:id', helpController.deleteHowToSellContent);

module.exports = router;
