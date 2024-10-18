const Transaction = require('../models/transactionModel');

exports.getAllTransactions = async (req, res) => {
  try {
    // Get 'page' and 'limit' from query params, or set default values
    const page = parseInt(req.query.page) || 1;   // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the starting index for the transactions to fetch
    const startIndex = (page - 1) * limit;

    // Get the total number of transactions
    const totalTransactions = await Transaction.countDocuments();

    // Fetch the transactions with pagination
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalTransactions / limit);

    // Send response with transactions and pagination info
    res.status(200).json({
      totalTransactions,
      totalPages,
      currentPage: page,
      transactionsPerPage: limit,
      transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

