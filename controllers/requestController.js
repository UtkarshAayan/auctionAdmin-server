const Request = require('../models/requestModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')


exports.getRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Create a query object based on the status filter
    const query = status ? { status } : {};

    // Find requests with pagination and status filtering
    const requests = await Request.find(query).skip(skip).limit(parseInt(limit)).exec();
    
    // Count the total number of documents matching the query
    const totalRequests = await Request.countDocuments(query).exec();
    const totalPages = Math.ceil(totalRequests / limit);

    return next(createSuccess(200, "All Requests", {
      requests,
      currentPage: parseInt(page),
      totalPages,
      totalRequests
    }));
  } catch (err) {
    return next(createError(500, "Internal Server Error"));
  }
};


exports.getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return next(createError(404, "Request Not Found"));
    }

    return next(createSuccess(200, "Single Request", request));
  } catch (error) {
    return next(createError(500, "Internal Server Error1"))
  }
};

exports.deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await Request.findByIdAndDelete(id);
    if (!request) {
      return next(createError(404, "Request Not Found"));
    }
    return next(createSuccess(200, "Request Deleted", request));
  } catch (error) {
    return next(createError(500, "Internal Server Error1"))
  }
}

exports.updateRequestStatus = async (req, res, next) => {
  try {
    const requestId = req.params.id;

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status: 'closed' },
      { new: true }
    );

    if (!updatedRequest) {
      return next(createError(404, 'Request not found'));
    }

    return next(createSuccess(200, 'Request status updated successfully', updatedRequest));
  } catch (error) {
    console.error('Error updating request status:', error);
    return next(createError(500, 'Internal Server Error!'));
  }

}