const Terms = require('../models/termsModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')


exports.createTerms = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const newContent = new Terms({ title, content });
      await newContent.save();
      return next(createSuccess(200, "Terms Content Created", newContent));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  

  exports.getTerms = async (req, res, next) => {
    try {
      const contents = await Terms.find();
      return next(createSuccess(200, "All Terms Content", contents));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  

  exports.updateTerms = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const updatedContent = await Terms.findByIdAndUpdate(id, { title, content }, { new: true });
      if (!updatedContent) {
        return next(createError(404, "Content not found"))
      }
      return next(createSuccess(200, "Content Updated", updatedContent));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  

  exports.deleteTerms = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedContent = await Terms.findByIdAndDelete(id);
      if (!deletedContent) {
        return next(createError(404, "Content not found"))
      }
      return next(createSuccess(200, "Content deleted"));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  