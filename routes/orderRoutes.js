const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create Order
router.post('/', orderController.createOrder);

router.post('/BuynowOrder', orderController.createOrderForBuynow);

// Get Order Summary
router.get('/:id', orderController.getOrderSummary);

router.get('/', orderController.getAllOrders);

router.delete('/:id', orderController.deleteOrder);
router.patch('/update-status', orderController.updateOrderStatus);

module.exports = router;
