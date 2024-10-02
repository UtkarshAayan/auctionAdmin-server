const Product = require('../models/sellerProductFormModel')
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')
const getAllBuyer = async (req, res,next) => {
    try {
        const aggregation = [];
        aggregation.push({
            $match: {
                isActive: true,
                proVerifyByAdmin: true,
                isSuspended:false
            }
        })
        const products = await Product.aggregate(aggregation);
    
        return next(createSuccess(200, "All Verified Products", products));
    } catch (err) {
        return next(createError(500, "Internal Server Error!",err))
    }
}

module.exports = { getAllBuyer }