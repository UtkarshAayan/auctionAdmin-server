const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Product = require('../models/sellerProductFormModel')
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')
const path = require('path');
const fs = require('fs');
//to Create user 
const createProduct = async (req, res, next) => {
  try {
    const role = await Role.find({ role: 'Seller' });

    const {
      productName,
      category,
      color,
      productCondition,
      productDescription,
      subcategory,
      lotNumber,
      brand,
      startingPrice,
      reservePrice,
      saleTax,
      startDate,
      endDate,
      buyerPremium,
      shipping,
      collect,
      startTime,
      stopTime,
      address,
      town,
      country,
      minimumIncrementAmount,
      currentBid
    } = req.body;
    if (!req.files || req.files.length === 0) {
      return next(createError(400, "No files uploaded"))
    }

    const uploadDocuments = req.files.map(file => {
      const filename = Date.now() + path.extname(file.originalname);
      const filepath = path.join(__dirname, '../uploads', filename);

      fs.writeFileSync(filepath, file.buffer); // Save the file to the filesystem

      return {
        filename,
        contentType: file.mimetype
      };
    });
    const newProduct = new Product({
      productName,
      category,
      color,
      productCondition,
      productDescription,
      subcategory,
      lotNumber,
      brand,
      startingPrice,
      currentBid,
      reservePrice,
      saleTax,
      startDate,
      endDate,
      buyerPremium,
      shipping,
      collect,
      startTime,
      stopTime,
      address,
      town,
      country,
      minimumIncrementAmount,
      uploadDocuments,
      proVerifyByAdmin: false,
      isActive: true,
      isSuspended: false,
      userId: req.cookies.userId,
      roles: role
    })
    // if (req.file) {
    //     newProduct.uploadDocuments = req.file.path; 
    //   }
    await newProduct.save();
    return next(createSuccess(200, "Auction Created Successfully"))
  }
  catch (error) {
    return next(createError(500, "Something went wrong"))
  }
}
//get All Auction
const getAllAuction = async (req, res, next) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 10, search = '' } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Build the search query
    const searchQuery = search
      ? { productName: { $regex: search, $options: 'i' } } // Case-insensitive search on productName
      : {};

    // Find products with pagination and search
    const products = await Product.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Get the total count of products for pagination
    const totalProducts = await Product.countDocuments(searchQuery);

    // Add URLs to the images
    const proWithImageURLs = products.map((user) => {
      // Map uploadDocuments to include URLs
      const imagesWithURLs = user.uploadDocuments.map((image) => {
        return {
          ...image._doc,
          url: `http://51.21.113.68:3000/api/product/uploadDocuments/${image.filename}`,
        };
      });

      // Map essentialDocs to include URLs
      const essentialDocsWithURLs = user.essentialDocs ? user.essentialDocs.map((doc) => {
        return {
          ...doc._doc,
          // url: `${req.protocol}://${req.get("host")}/api/product/essentialDocs/${doc.filename}`,
          url: `http://51.21.113.68:3000/api/product/essentialDocs/${doc.filename}`,
        };
      }) : [];

      return {
        ...user._doc,
        uploadDocuments: imagesWithURLs,
        essentialDocs: essentialDocsWithURLs, // Add essentialDocs with URLs
      };
    });

    // Respond with the paginated data
    return next(createSuccess(200, "All Products", {
      products: proWithImageURLs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
      totalProducts: totalProducts
    }));

  } catch (error) {
    return next(createError(500, "Internal Server Error!"));
  }
}

//get Auction
const getAuction = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('bids').exec();

    if (!product) {
      return next(createError(404, "Product Not Found"));
    }

    // Sort bids by amount in descending order
    product.bids.sort((a, b) => b.amount - a.amount);

    // Map uploadDocuments to include URLs
    const imagesWithURLs = product.uploadDocuments.map((image) => {
      return {
        ...image._doc,
        url: `http://51.21.113.68:3000/api/product/uploadDocuments/${image.filename}`,
      };
    });

    // Map essentialDocs to include URLs
    const essentialDocsWithURLs = product.essentialDocs ? product.essentialDocs.map((doc) => {
      return {
        ...doc._doc,
        url: `http://51.21.113.68:3000/api/product/essentialDocs/${doc.filename}`,
      };
    }) : [];

    const productWithImageURLs = {
      ...product._doc,
      uploadDocuments: imagesWithURLs,
      essentialDocs: essentialDocsWithURLs, // Add essentialDocs with URLs
    };

    return next(createSuccess(200, "Single Product", productWithImageURLs));
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};
//byuser

const getProductsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Fetch only active products for the given userId
    const products = await Product.find({ userId, status: 'active' });

    const proWithImageURLs = products.map((user) => {
      // Map uploadDocuments to include URLs
      const imagesWithURLs = user.uploadDocuments.map((image) => {
        return {
          ...image._doc,
          url: `http://51.21.113.68:3000/api/product/uploadDocuments/${image.filename}`,
        };
      });

      // Map essentialDocs to include URLs
      const essentialDocsWithURLs = user.essentialDocs ? user.essentialDocs.map((doc) => {
        return {
          ...doc._doc,
          url: `http://51.21.113.68:3000/api/product/essentialDocs/${doc.filename}`,
        };
      }) : [];

      return {
        ...user._doc,
        uploadDocuments: imagesWithURLs,
        essentialDocs: essentialDocsWithURLs, // Add essentialDocs with URLs
      };
    });

    return next(createSuccess(200, "Products By UserId", proWithImageURLs));
  } catch (error) {
    return next(createError(500, "Internal Server Error!"));
  }
};

//update Auction
const updateAuction = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      productName,
      category,
      color,
      productCondition,
      productDescription,
      subcategory,
      lotNumber,
      brand,
      startingPrice,
      reservePrice,
      currentBid,
      saleTax,
      startDate,
      endDate,
      buyerPremium,
      shipping,
      shippingPrice,
      collect,
      startTime,
      stopTime,
      address,
      town,
      buyNowPrice,
      country,
      minimumIncrementAmount,
    } = req.body;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return next(createError(404, "Product Not Found"));
    }

    // Handle file uploads
    let uploadDocuments = product.uploadDocuments; // Retain existing images if no new files uploaded
    if (req.files['uploadDocuments'] && req.files['uploadDocuments'].length > 0) {
      // Delete old images from the file system
      uploadDocuments.forEach((image) => {
        const filepath = path.join(__dirname, "../uploads", image.filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      });

      // Save new files
      uploadDocuments = req.files['uploadDocuments'].map((file) => {
        const filename = Date.now() + path.extname(file.originalname);
        const filepath = path.join(__dirname, "../uploads", filename);

        fs.writeFileSync(filepath, file.buffer); // Save the file to the filesystem

        return {
          filename,
          contentType: file.mimetype,
        };
      });
    }

    // Handle essentialDocs updates
    let essentialDocs = product.essentialDocs; // Retain existing docs if no new files uploaded
    if (req.files['essentialDocs'] && req.files['essentialDocs'].length > 0) {
      // Delete old essential docs from the file system
      essentialDocs.forEach((doc) => {
        const filepath = path.join(__dirname, "../uploads", doc.filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      });

      // Save new essential docs
      essentialDocs = req.files['essentialDocs'].map((file) => {
        const filename = Date.now() + path.extname(file.originalname);
        const filepath = path.join(__dirname, "../uploads", filename);

        fs.writeFileSync(filepath, file.buffer); // Save the file to the filesystem

        return {
          filename,
          contentType: file.mimetype,
        };
      });
    }

    // Update product details
    product.productName = productName || product.productName;
    product.category = category || product.category;
    product.color = color || product.color;
    product.productCondition = productCondition || product.productCondition;
    product.productDescription = productDescription || product.productDescription;
    product.subcategory = subcategory || product.subcategory;
    product.lotNumber = lotNumber || product.lotNumber;
    product.brand = brand || product.brand;
    product.startingPrice = startingPrice || product.startingPrice;
    product.currentBid = currentBid || product.currentBid;
    product.reservePrice = reservePrice || product.reservePrice;
    product.saleTax = saleTax || product.saleTax;
    product.startDate = startDate || product.startDate;
    product.endDate = endDate || product.endDate;
    product.shipping = shipping || product.shipping;
    product.collect = collect || product.collect;
    product.buyerPremium = buyerPremium || product.buyerPremium;
    product.startTime = startTime || product.startTime;
    product.stopTime = stopTime || product.stopTime;
    product.address = address || product.address;
    product.town = town || product.town;
    product.buyNowPrice = buyNowPrice || product.buyNowPrice;
    product.country = country || product.country;
    product.minimumIncrementAmount = minimumIncrementAmount || product.minimumIncrementAmount;
    product.uploadDocuments = uploadDocuments;
    product.essentialDocs = essentialDocs; // Update essentialDocs

    // Conditionally update shippingPrice
    if (shipping) {
      product.shippingPrice = shippingPrice || product.shippingPrice;
    } else {
      product.shippingPrice = null; // If shipping is not true, set shippingPrice to null
    }

    // Save updated product
    await product.save();
    return next(createSuccess(200, "Product updated successfully"));
  } catch (error) {
    console.error("Error updating product:", error);
    return next(createError(500, "Something went wrong"));
  }
};



//delete Auction
const deleteAuction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return next(createError(404, "Product Not Found"));
    }
    return next(createSuccess(200, "Product Deleted", product));
  } catch (error) {
    return next(createError(500, "Internal Server Error1"));
  }
};

const getImage = (req, res, next) => {
  const filepath = path.join(__dirname, '../uploads', req.params.filename);
  fs.readFile(filepath, (err, data) => {
    if (err) {
      return next(createError(404, "Image Not Found"));
    }
    const image = data;
    const mimeType = req.params.filename.split('.').pop();
    res.setHeader('Content-Type', `image/${mimeType}`);
    res.send(image);
  });
};
//for documents
const getDocs = (req, res, next) => {
  const filepath = path.join(__dirname, "../uploads", req.params.filename);
  fs.readFile(filepath, (err, data) => {
    if (err) {
      return next(createError(404, "Docs Not Found"));
    }
    const image = data;
    const mimeType = req.params.filename.split(".").pop();
    res.setHeader("Content-Type", `image/${mimeType}`);
    res.send(image);
  });
};


module.exports = {
  createProduct, getAllAuction, getAuction, updateAuction, deleteAuction, getProductsByUserId, getImage, getDocs
}