const Bid = require('../models/bidModel');
const Product = require('../models/sellerProductFormModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')

exports.placeBid = async (req, res, next) => {
    try {
        const { auctionId, amount } = req.body;
        const auction = await Product.findById(auctionId);
      
        if (!auction || auction.proVerifyByAdmin !== true || amount <= auction.currentBid) {
            return next(createError(400, "Invalid bid",err))
        }
      
        const bid = new Bid({ amount, auction: auctionId, buyerId: req.body.userId});
        
        auction.currentBid = amount;
       
        await bid.save();
        await auction.save();
     
        return next(createSuccess(200, "Auction Created Successfully"))
        
    } catch (err) {
        return next(createError(500, "Something went wrong",err))
    }
};

exports.getCurrentBid = async (req, res, next) => {
    try {
        const auction = await Product.findById(req.params.id);
        if (!auction) {
            return next(createError(404, "Auction not found"))
        }
      //  res.status(200).json({ currentBid: auction.currentBid });
        return next(createSuccess(200, "Current Bid",auction ))
    } catch (err) {
        return next(createError(500, "Auction not found",err))
    }
};
