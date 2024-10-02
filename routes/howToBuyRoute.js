const express = require('express');
const router = express.Router();
const helpController = require('../controllers/helpController');

// Create new "How to Buy" content
router.post('/how-to-buy', helpController.createHowToBuyContent);

// Get all "How to Buy" content
router.get('/how-to-buy', helpController.getHowToBuyContents);

// Update "How to Buy" content by ID
router.put('/how-to-buy/:id', helpController.updateHowToBuyContent);

// Delete "How to Buy" content by ID
router.delete('/how-to-buy/:id', helpController.deleteHowToBuyContent);

module.exports = router;
