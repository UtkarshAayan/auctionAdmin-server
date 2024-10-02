const express = require('express');
const { placeBid,getCurrentBid } = require('../controllers/bidController');
// const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', placeBid);
router.get('/:id', getCurrentBid);
module.exports = router;
