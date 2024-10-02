const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true }, // HTML content
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
