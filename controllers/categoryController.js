const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    // Log for debugging
    console.log("Request Body:", req.body);
    console.log("Files:", req.files);

    // Handle category image
    const categoryImage = req.files['categoryImage'] ? req.files['categoryImage'][0].filename : null;

    // Handle subcategory images
    const subcategoryImages = req.files['subcategoryImage'] || [];

    // Manually build subcategories array from form-data
    const subcategories = [];
    let index = 0;

    // Iterate over possible subcategories (assuming indexed subcategory names like subcategories[0].name)
    while (req.body[`subcategories[${index}].name`]) {
      subcategories.push({
        name: req.body[`subcategories[${index}].name`],
        subcategoryImage: subcategoryImages[index] ? `/uploads/${subcategoryImages[index].filename}` : null,
      });
      index++;
    }

    // Build category object
    const categoryData = {
      name: req.body.name,
      categoryImage: categoryImage ? `/uploads/${categoryImage}` : null,
      subcategories: subcategories,  // Manually constructed subcategories
    };

    // Create and save the category
    const category = new Category(categoryData);
    await category.save();

    // Respond with the created category
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    // Handle any error that occurs during the creation process
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    // Base URL for images
    const baseUrl = `http://${req.get('host')}`; // Ensure the path is correctly prefixed

    // Map through categories to add full URLs
    const categoriesWithFullUrls = categories.map(category => {
      // Map subcategories to include full URLs
      const subcategoriesWithUrls = category.subcategories.map(subcategory => ({
        ...subcategory.toObject(),
        subcategoryImage: subcategory.subcategoryImage
          ? `${baseUrl}${subcategory.subcategoryImage}`
          : null,
      }));

      return {
        ...category.toObject(),
        categoryImage: category.categoryImage
          ? `${baseUrl}${category.categoryImage}`
          : null,
        subcategories: subcategoriesWithUrls,
      };
    });

    res.status(200).json({ success: true, data: categoriesWithFullUrls });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Files:", req.files);

    // Find the existing category by ID
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Update the category name if provided
    if (req.body.name) {
      category.name = req.body.name;
    }

    // Update the category image if provided
    if (req.files && req.files['categoryImage']) {
      category.categoryImage = `/uploads/${req.files['categoryImage'][0].filename}`;
    }

    // Handle subcategory updates
    const subcategoryImages = req.files ? req.files['subcategoryImage'] || [] : [];

    // Create a new subcategories array for updates
    const updatedSubcategories = [];
    let index = 0;

    // Iterate over possible subcategory updates from the request body
    while (req.body[`subcategories[${index}].name`] !== undefined) {
      const subcategoryName = req.body[`subcategories[${index}].name`];
      const subcategoryImage = subcategoryImages[index] ? `/uploads/${subcategoryImages[index].filename}` : null;

      // Update existing subcategory or add new one
      if (index < category.subcategories.length) {
        // Update existing subcategory
        const existingSubcategory = category.subcategories[index];
        existingSubcategory.name = subcategoryName;
        existingSubcategory.subcategoryImage = subcategoryImage;
      } else {
        // Add new subcategory
        updatedSubcategories.push({
          name: subcategoryName,
          subcategoryImage: subcategoryImage
        });
      }

      index++;
    }

    // Update category's subcategories
    category.subcategories = category.subcategories.slice(0, index).concat(updatedSubcategories);

    // Save the updated category
    const updatedCategory = await category.save();

    // Base URL for images
    const baseUrl = `http://${req.get('host')}`;

    // Add full URLs to category and subcategory images for response
    const categoryWithFullUrls = {
      ...updatedCategory.toObject(),
      categoryImage: updatedCategory.categoryImage
        ? `${baseUrl}${updatedCategory.categoryImage}`
        : null,
      subcategories: updatedCategory.subcategories.map(subcategory => ({
        ...subcategory.toObject(),
        subcategoryImage: subcategory.subcategoryImage
          ? `${baseUrl}${subcategory.subcategoryImage}`
          : null,
      })),
    };

    // Respond with the updated category
    res.status(200).json({ success: true, data: categoryWithFullUrls });
  } catch (error) {
    // Handle any error that occurs during the update process
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const subcategoryId = req.params.subcategoryId;

    // Find the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    // Find the subcategory index
    const subcategoryIndex = category.subcategories.findIndex(subcat => subcat._id.toString() === subcategoryId);
    if (subcategoryIndex === -1) {
      return res.status(404).send('Subcategory not found');
    }

    // Remove the subcategory
    category.subcategories.splice(subcategoryIndex, 1);
    await category.save();

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


