// routes/adminSettingsRoutes.js
const express = require('express');
const router = express.Router();
const adminSettingsController = require('../controllers/adminSettingsController');

// Define the route to update settings
router.put('/saleTax', adminSettingsController.updateSaleTax);
router.put('/buyerPremium', adminSettingsController.updateBuyerPremium);

router.get('/settings', adminSettingsController.getSettings);

module.exports = router;
