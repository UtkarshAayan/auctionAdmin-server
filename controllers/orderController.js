const Order = require('../models/orderSummaryModel');
const Product = require('../models/sellerProductFormModel');
const User = require('../models/userModel');
const Bid = require('../models/bidModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')


const getFormattedAddress = (address) => {
  return `${address.fullName}, ${address.street}, ${address.city}, ${address.state}, ${address.zip}`;
};

//order for startingPrice
exports.createOrder = async (req, res, next) => {
  const { productId, buyerId, addressId } = req.body;

  try {
    const user = await User.findById(buyerId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    // Check if shipping is required
    let address;
    if (product.shipping) {
      address = user.addresses.id(addressId);
      if (!address) {
        return next(createError(404, "Address not found"));
      }
    }

    const currentBid = product.currentBid; // Assuming 'currentBid' is stored in the product model

    const order = new Order({
      product: productId,
      buyer: buyerId,
      address: product.shipping ? getFormattedAddress(address) : product.address, // Only add address if shipping is true
      orderDate: new Date(),
      currentBid: currentBid
    });

    await order.save();

    // Update product status to sold
    await Product.findByIdAndUpdate(productId, { status: 'Sold' });

    return next(createSuccess(201, "Order created successfully", {
      _id: order._id, // Ensure _id is included in the response
      productId: order.product,
      address: order.address,
      buyer: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
      },
      orderDate: order.orderDate,
      currentBid: order.currentBid
    }));
  } catch (error) {
    console.error('Error creating order:', error);
    return next(createError(500, "Could not create order"));
  }
};


//order for buynowPrice
exports.createOrderForBuynow = async (req, res, next) => {
  const { productId, buyerId, addressId } = req.body;

  try {
    const user = await User.findById(buyerId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    // Check if shipping is required
    let address;
    if (product.shipping) {
      address = user.addresses.id(addressId);
      if (!address) {
        return next(createError(404, "Address not found"));
      }
    }

    const buyNowPrice = product.buyNowPrice; 
    const order = new Order({
      product: productId,
      buyer: buyerId,
      address: product.shipping ? getFormattedAddress(address) : product.address, // Only add address if shipping is true
      orderDate: new Date(),
      currentBid: buyNowPrice
    });

    await order.save();

    // Update product status to sold
    await Product.findByIdAndUpdate(productId, { status: 'Sold' });

    return next(createSuccess(201, "Order created successfully", {
      _id: order._id, // Ensure _id is included in the response
      productId: order.product,
      address: order.address,
      buyer: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
      },
      orderDate: order.orderDate,
      currentBid: order.currentBid
    }));
  } catch (error) {
    console.error('Error creating order:', error);
    return next(createError(500, "Could not create order"));
  }
};


exports.getOrderSummary = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product')
      .populate('buyer');

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    const user = await User.findById(order.buyer);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const product = await Product.findById(order.product._id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    const imagesWithURLs = product.uploadDocuments.map((image) => {
      return {
        ...image._doc,
        url: `http://51.21.113.68:3000/api/product/uploadDocuments/${image.filename}`,
      };
    });

    const productWithImageURLs = {
      ...product._doc,
      uploadDocuments: imagesWithURLs,
    };

    return next(createSuccess(200, "Order summary fetched successfully", {
      _id: order._id, // Ensure _id is included in the response
      product: productWithImageURLs,
      buyer: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
      },
      orderDate: order.orderDate,
      status: order.status,
      address: order.address,
      currentBid: order.currentBid
    }));
  } catch (error) {
    console.error('Error fetching order summary:', error);
    return next(createError(500, "Internal server error"));
  }
};

//all
exports.getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const status = req.query.status; // Get the status from the query parameters

    // Build the query object
    let query = {};
    if (status) {
      query.status = status;
    }

    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate('product')
      .populate('buyer')
      .sort({ orderDate: -1 })
      .skip(startIndex)
      .limit(limit);

    if (!orders || orders.length === 0) {
      return next(createSuccess(200, "No orders found", []));
    }

    const processedOrders = await Promise.all(
      orders.map(async (order) => {
        try {
          // Check if product or buyer is missing and skip if so
          if (!order.product || !order.buyer) {
            console.warn(`Order ID: ${order._id} skipped due to missing product or buyer`);
            return null; // Skip this order
          }

          const user = await User.findById(order.buyer);
          if (!user) {
            console.warn(`User not found for order ID: ${order._id}`);
            return null; // Skip this order
          }

          const product = await Product.findById(order.product._id);
          if (!product) {
            console.warn(`Product not found for order ID: ${order._id}`);
            return null; // Skip this order
          }

          const imagesWithURLs = product.uploadDocuments.map((image) => ({
            ...image._doc,
            url: `http://51.21.113.68:3000/api/product/uploadDocuments/${image.filename}`,
          }));

          const productWithImageURLs = {
            ...product._doc,
            uploadDocuments: imagesWithURLs,
          };

          return {
            _id: order._id,
            product: productWithImageURLs,
            buyer: {
              _id: user._id,
              name: user.name,
              email: user.email,
              contactNumber: user.contactNumber,
            },
            orderDate: order.orderDate,
            status: order.status,
            address: order.address,
            currentBid: order.currentBid,
          };
        } catch (innerError) {
          console.error(`Error processing order ID: ${order._id}`, innerError);
          return null;
        }
      })
    );

    // Filter out any null values from failed processing
    const validOrders = processedOrders.filter((order) => order !== null);

    const pagination = {
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      hasNextPage: page < Math.ceil(totalOrders / limit),
      hasPrevPage: page > 1,
    };

    return next(createSuccess(200, "All orders fetched successfully", {
      orders: validOrders,
      pagination,
    }));
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return next(createError(500, "Internal server error"));
  }
};


exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return next(createError(404, "Order not found."))
    }
    return next(createSuccess(200, "Order deleted successfully"));

  } catch (error) {
    return next(createError(500, "Something went wrong"))
  }
};


//update status

exports.updateOrderStatus = async (req, res, next) => {
  const { orderId, status } = req.body;

  // Ensure the status value is one of the predefined values
  const validStatuses = ['pending', 'on the way', 'delivered', 'cancel'];
  if (!validStatuses.includes(status)) {
    return next(createError(400, "Invalid status value"));
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return next(createError(404, "Order not found"));
    }

    // Update the order status
    order.status = status;
    await order.save();

    return next(createSuccess(200, "Order status updated successfully", {
      _id: order._id,
      status: order.status,
      product: order.product,
      buyer: order.buyer,
      address: order.address,
      orderDate: order.orderDate,
      currentBid: order.currentBid,
    }));
  } catch (error) {
    console.error('Error updating order status:', error);
    return next(createError(500, "Could not update order status"));
  }
};


