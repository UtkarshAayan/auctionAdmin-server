const express = require('express');
const router = express.Router();
const emailTemplateController = require('../controllers/emailTemplateController');

// Route to create a new email template
router.post('/email-templates', emailTemplateController.createTemplate);

// Route to get all email templates
router.get('/email-templates', emailTemplateController.getTemplates);

// Route to get a specific email template by ID
router.get('/email-templates/:id', emailTemplateController.getTemplateById);

// Route to update an existing email template by ID
router.put('/email-templates/:id', emailTemplateController.updateTemplate);

// Route to delete an email template by ID
router.delete('/email-templates/:id', emailTemplateController.deleteTemplate);

module.exports = router;
