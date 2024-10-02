const Privacy = require('../models/privacyPolicyModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')


exports.createPrivacy = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const newContent = new Privacy({ title, content });
      await newContent.save();
      return next(createSuccess(200, "Privacy Content Created", newContent));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  

  exports.getPrivacy = async (req, res, next) => {
    try {
      const contents = await Privacy.find();
      return next(createSuccess(200, "All Privacy Content", contents));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  

  exports.updatePrivacy = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const updatedContent = await Privacy.findByIdAndUpdate(id, { title, content }, { new: true });
      if (!updatedContent) {
        return next(createError(404, "Content not found"))
      }
      return next(createSuccess(200, "Content Updated", updatedContent));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  

  exports.deletePrivacy = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedContent = await Privacy.findByIdAndDelete(id);
      if (!deletedContent) {
        return next(createError(404, "Content not found"))
      }
      return next(createSuccess(200, "Content deleted"));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  