const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  buyer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  address: {
    type: String,
    required: false
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  currentBid: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'on the way', 'delivered', 'cancel'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
