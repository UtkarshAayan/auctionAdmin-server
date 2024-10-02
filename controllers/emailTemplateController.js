const EmailTemplate = require('../models/emailTemplateModel');

// Create a new template
exports.createTemplate = async (req, res) => {
  try {
    const { title, subject, body } = req.body;
    const template = new EmailTemplate({ title, subject, body });
    await template.save();
    res.status(200).json({ message: 'Template created successfully', template });
  } catch (error) {
    res.status(500).json({ message: 'Error creating template', error });
  }
};

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error });
  }
};

// Get a specific template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await EmailTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching template', error });
  }
};

// Update an existing template
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, body } = req.body;
    const template = await EmailTemplate.findByIdAndUpdate(id, { title, subject, body }, { new: true });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json({ message: 'Template updated successfully', template });
  } catch (error) {
    res.status(500).json({ message: 'Error updating template', error });
  }
};

// Delete a template
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await EmailTemplate.findByIdAndDelete(id);
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template', error });
  }
};
