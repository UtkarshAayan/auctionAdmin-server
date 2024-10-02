const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Create new "How to Buy" content
router.get('/all', requestController.getRequests);
router.get('/:id', requestController.getRequestById);
router.delete('/:id', requestController.deleteRequest); 
router.patch('/:id/status', requestController.updateRequestStatus);
module.exports = router;
