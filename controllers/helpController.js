const HelpContent = require('../models/helpContentModel');
const BuyContent = require('../models/buyContentModel');
const SellContent = require('../models/sellContentModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')

exports.createHelpContent = async (req, res, next) => {
  try {
    const helpContent = new HelpContent(req.body);
    await helpContent.save();
    return next(createSuccess(200, "Content Created", helpContent));
  } catch (err) {
    return next(createError(500, "Something went wrong"))
  }
};

exports.getAllHelpContent = async (req, res, next) => {
  try {
    const helpContents = await HelpContent.find();
    return next(createSuccess(200, "All Contents", helpContents));
  } catch (err) {
    return next(createError(500, "Something went wrong"))
  }
};


exports.updateHelpContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const helpContent = await HelpContent.findByIdAndUpdate(id, { title, content }, { new: true });

    if (!helpContent) {
      return next(createError(404, "Help content not found."))
    }
    return next(createSuccess(200, "Content Updated", helpContent));
  } catch (error) {
    return next(createError(500, "Something went wrong"))
  }
};

exports.deleteHelpContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const helpContent = await HelpContent.findByIdAndDelete(id);

    if (!helpContent) {
      return next(createError(404, "Help content not found."))
    }
    return next(createSuccess(200, "Help content deleted successfully"));

  } catch (error) {
    return next(createError(500, "Something went wrong"))
  }
};

// Create new "How to Sell" content
exports.createHowToSellContent = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const newContent = new SellContent({ title, content });
    await newContent.save();
    return next(createSuccess(200, "Sell Content Created", newContent));
  } catch (err) {
    return next(createError(500, "Something went wrong"))
  }
};

// Get all "How to Sell" content
exports.getHowToSellContents = async (req, res, next) => {
  try {
    const contents = await SellContent.find();
    return next(createSuccess(200, "All Sell Content", contents));
  } catch (err) {
    return next(createError(500, "Something went wrong"))
  }
};

// Update "How to Sell" content by ID
exports.updateHowToSellContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedContent = await SellContent.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!updatedContent) {
      return next(createError(404, "Sell Content not found"))
    }
    return next(createSuccess(200, "Sell Content Updated", updatedContent));
  } catch (err) {
    return next(createError(500, "Something went wrong"))
  }
};

// Delete "How to Sell" content by ID
exports.deleteHowToSellContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContent = await SellContent.findByIdAndDelete(id);
    if (!deletedContent) {
      return next(createError(404, "Sell Content not found"))
    }
    return next(createSuccess(200, "Content deleted"));
  } catch (err) {
    return next(createError(500, "Something went wrong"))
  }
};


// Create new "How to Buy" content
exports.createHowToBuyContent = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const newContent = new BuyContent({ title, content });
    await newContent.save();
    return next(createSuccess(200, "Buy Content Created", newContent));
  } catch (err) {
    return next(createError(500, "Something went wrong"))
  }
};

// Get all "How to Buy" content
exports.getHowToBuyContents = async (req, res, next) => {
  try {
    const contents = await BuyContent.find();
    return next(createSuccess(200, "All Buy Content", contents));
  } catch (err) {
    return next(createError(500, "Something went wrong"))
  }
};

// Update "How to Buy" content by ID
exports.updateHowToBuyContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedContent = await BuyContent.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!updatedContent) {
      return next(createError(404, "Content not found"))
    }
    return next(createSuccess(200, "Content Updated", updatedContent));
  } catch (err) {
    return next(createError(500, "Something went wrong"))
  }
};

// Delete "How to Buy" content by ID
exports.deleteHowToBuyContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContent = await BuyContent.findByIdAndDelete(id);
    if (!deletedContent) {
      return next(createError(404, "Content not found"))
    }
    return next(createSuccess(200, "Content deleted"));
  } catch (err) {
    return next(createError(500, "Something went wrong"))
  }
};

