const mongoose = require('mongoose');
const moment = require('moment');

const imageSchema2 = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true }
});
const ProductSchema = mongoose.Schema(
    {
        productName: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: false
        },
        color: {
            type: String,
            required: false
        },
        productCondition: {
            type: String,
            required: false
        },
        productDescription: {
            type: String,
            required: false
        },
        subcategory: {
            type: String,
            required: false
        },
        lotNumber: {
            type: String,
            required: false,
            default: 'Pending'
        },
        brand: {
            type: String,
            required: false
        },
        startingPrice: {
            type: Number,
            required: false
        },
        reservePrice: {
            type: Number,
            required: false
        },
        saleTax: {
            type: Boolean,
            required: false
        },
       
        buyerPremium: {
            type: Boolean,
            required: false
        },
        shipping: {
            type: Boolean,
            required: false
        },
        shippingPrice: {
            type: Number,
            default: null
        },
        collect: {
            type: Boolean,
            required: false
        },
        address: {
            type: String,
            required: false
        },
        town: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false
        },
        uploadDocuments: [imageSchema2],
        essentialDocs: [imageSchema2],
        proVerifyByAdmin: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isSuspended: {
            type: Boolean,
            default: false
        },
        minimumIncrementAmount: {
            type: Number,
            required: false
        },
        wishListStatus: { type: Boolean, default: false },
        lastThreeBuyers: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            email: { type: String },
            amount: { type: Number }
        }],
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        buyNowPrice: {
            type: Number,
            required: false
        },
        buyNowStatus: {
            type: Boolean,
            default: false
        },
        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String,
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        stopTime: {
            type: String,
            required: true
        },
        currentBid: { type: Number, default: 0 },
        nextValidBid: { type: Number, default: 0 },
        bids: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bid'
        }],
        winningBid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bid',
            default: null
        },
        winningBuyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        status: {
            type: String,
            default: 'active' // active, expired
        }
    },
    {
        timestamps: true
    }
);

ProductSchema.methods.getStartTime = function () {
    return moment(`${this.startDate}T${this.startTime}:00`).toDate();
};

ProductSchema.methods.getEndTime = function () {
    return moment(`${this.endDate}T${this.stopTime}:00`).toDate();
};


module.exports = mongoose.model('Product', ProductSchema); 