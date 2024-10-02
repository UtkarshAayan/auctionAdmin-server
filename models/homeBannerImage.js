// models/bannerModel.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  bannerImages: [{
    type: String, // Will store the URLs of the images
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
