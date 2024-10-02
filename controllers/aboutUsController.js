const About = require('../models/aboutusModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')


exports.createAbout = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const newContent = new About({ title, content });
      await newContent.save();
      return next(createSuccess(200, "About Us Content Created", newContent));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  

  exports.getAbout = async (req, res, next) => {
    try {
      const contents = await About.find();
      return next(createSuccess(200, "All About Us Content", contents));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  

  exports.updateAbout = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const updatedContent = await About.findByIdAndUpdate(id, { title, content }, { new: true });
      if (!updatedContent) {
        return next(createError(404, "About Us Content not found"))
      }
      return next(createSuccess(200, "About Us Content Updated", updatedContent));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  

  exports.deleteAbout = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedContent = await About.findByIdAndDelete(id);
      if (!deletedContent) {
        return next(createError(404, "About Us Content not found"))
      }
      return next(createSuccess(200, "About Us Content deleted"));
    } catch (err) {
      return next(createError(500, "Something went wrong"))
    }
  };
  