
const AdminSettings = require('../models/adminSettings');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')


exports.updateSaleTax = async (req, res, next) => {
  const { saleTax } = req.body;

  try {
    const settings = await AdminSettings.findOneAndUpdate(
      {}, // Find the document to update
      { saleTax },
      { new: true, upsert: true } // Create a new document if none exists
    );

    return next(createSuccess(200, "Settings Updated Successfully", settings));
  } catch (error) {
    return next(createError(500, "Failed to Update"));
  }
};

exports.updateBuyerPremium = async (req, res, next) => {
  const { buyerPremium } = req.body;

  try {
    const settings = await AdminSettings.findOneAndUpdate(
      {}, // Find the document to update
      { buyerPremium },
      { new: true, upsert: true } // Create a new document if none exists
    );

    return next(createSuccess(200, "Buyer Premium Updated Successfully", settings));
  } catch (error) {
    return next(createError(500, "Failed to Update Buyer Premium"));
  }
};





exports.getSettings = async (req, res,next) => {
  try {
    const settings = await AdminSettings.findOne({});
    if (!settings) {
      return next(createError(404, "Setting Not Found"))
    }
    return next(createSuccess(200, "All Settings",settings))
  } catch (error) {
    return next(createError(500, "Failed to Retrieve  Settings"))
  }
};
