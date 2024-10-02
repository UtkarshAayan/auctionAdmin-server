const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategoryImage: {
    type: String, // Store the image URL or path
  },
});

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categoryImage: {
    type: String, // Store the image URL or path
  },
  subcategories: [SubcategorySchema],
});

module.exports = mongoose.model('Category', CategorySchema);
