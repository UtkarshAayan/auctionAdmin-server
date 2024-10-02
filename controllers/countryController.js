const Country = require('../models/countryModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')
// Create a new country
exports.createCountry = async (req, res, next) => {
    try {
        const { name, code } = req.body;
        const country = new Country({ name, code });
        await country.save();
        return next(createSuccess(200, "Country added successfully", country));
    } catch (error) {
        next(error);
    }
};

// Get all countries
exports.getCountries = async (req, res, next) => {
    try {
        const countries = await Country.find();
        return next(createSuccess(200, "All Countries", countries));
    } catch (error) {
        next(error);
    }
};

// Get country by ID
exports.getCountryById = async (req, res, next) => {
    try {
      const country = await Country.findById(req.params.id);
      if (!country) {
        return next(createSuccess(404, "Country not found"));
      }
      return next(createSuccess(200, "One Country", country));
    } catch (error) {
      next(error);
    }
  };

  // Update country by ID
  exports.updateCountry = async (req, res, next) => {
    try {
      const { name, code } = req.body;
      const country = await Country.findByIdAndUpdate(
        req.params.id,
        { name, code },
        { new: true, runValidators: true }
      );
  
      if (!country) {
        return next(createSuccess(404, "Country not found"));
      }
      return next(createSuccess(200, "Country updated successfully", country));
    } catch (error) {
      next(error);
    }
  };
  
  // Delete country by ID
  exports.deletecountry =  async (req, res, next) => {
    try {
      const country = await Country.findByIdAndDelete(req.params.id);
  
      if (!country) {
        return next(createSuccess(404, "Country not found"));
      }

      return next(createSuccess(200, "Country deleted successfully"));
    } catch (error) {
      next(error);
    }
  };
  

