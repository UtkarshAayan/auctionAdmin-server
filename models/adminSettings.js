// models/AdminSettings.js
const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
  saleTax: {
    type: Number,
    required: true,
    default: 0,
  },
  buyerPremium: {
    type: Number,
    required: true,
    default: 0,
  },
  // Add other settings as needed
});

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
