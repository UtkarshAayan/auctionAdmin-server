const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', bidSchema);
