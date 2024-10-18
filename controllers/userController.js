const User = require('../models/userModel');
const Role = require('../models/roleModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')
const nodemailer = require('nodemailer');
const Product = require('../models/sellerProductFormModel')
//to Create user 
const register = async (req, res, next) => {
    try {
        const role = await Role.find({ role: 'User' });
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            contactNumber: req.body.contactNumber,
            roles: role
        })
        await newUser.save();
        //return res.status(200).json("User Registered Successfully")
        return next(createSuccess(200, "User Registered Successfully"))
    }
    catch (error) {
        //return res.status(500).send("Something went wrong")
        return next(createError(500, "Something went wrong"))
    }
}
//get ALL users
const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, search = '' } = req.query;
        const skip = (page - 1) * limit;

        const query = search ? { $or: [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};

        const users = await User.find(query).skip(skip).limit(parseInt(limit)).exec();
        const totalUsers = await User.countDocuments(query).exec();
        const totalPages = Math.ceil(totalUsers / limit);

        return next(createSuccess(200, "All Users", {
            users,
            currentPage: parseInt(page),
            totalPages,
            totalUsers
        }));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"))
    }
}
//get all seller
const getAllSellers = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, search = '' } = req.query;
        const skip = (page - 1) * limit;

        // Query to filter sellers and apply search if provided
        const query = { isSeller: true };
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const sellers = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).exec();
        const totalSellers = await User.countDocuments(query).exec();
        const totalPages = Math.ceil(totalSellers / limit);

        return res.status(200).json({
            message: "All Sellers",
            sellers,
            currentPage: parseInt(page),
            totalPages,
            totalSellers
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


//get All buyers
const getAllBuyers = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, search = '' } = req.query;
        const skip = (page - 1) * limit;

        // Query to filter buyers and apply search if provided
        const query = { isBuyer: true };
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const buyers = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).exec();
        const totalBuyers = await User.countDocuments(query).exec();
        const totalPages = Math.ceil(totalBuyers / limit);

        return res.status(200).json({
            message: "All Buyers",
            buyers,
            currentPage: parseInt(page),
            totalPages,
            totalBuyers
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


//get all subadmin
const getAllSubAdmins = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, search = '' } = req.query;
        const skip = (page - 1) * limit;

        // Query to filter sub-admins and apply search if provided
        const query = { isSubadmin: true };
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const subAdmins = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).exec();
        const totalSubAdmins = await User.countDocuments(query).exec();
        const totalPages = Math.ceil(totalSubAdmins / limit);

        return res.status(200).json({
            message: "All Sub-Admins",
            subAdmins,
            currentPage: parseInt(page),
            totalPages,
            totalSubAdmins
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


//get user
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(createError(404, "User Not Found"));
        }
        return next(createSuccess(200, "Single User", user));
    } catch (error) {
        return next(createError(500, "Internal Server Error1"))
    }
}

//update user
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        if (!user) {
            return next(createError(404, "User Not Found"));
        }
        return next(createSuccess(200, "User Details Updated", user));
    } catch (error) {
        return next(createError(500, "Internal Server Error1"))
    }
}


//delete user
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return next(createError(404, "User Not Found"));
        }
        return next(createSuccess(200, "User Deleted", user));
    } catch (error) {
        return next(createError(500, "Internal Server Error1"))
    }
}

//user verification Start


// Create a transporter object using the default SMTP transport

//user Verification End



//product Verification start
const proTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "ut.gupta29@gmail.com",
        pass: "yver vjuu fvbb hcot"
    }
});


const productVerificationEmail = async (userEmail) => {
    try {
        // Send mail with defined transport object
        const info = await proTransporter.sendMail({
            from: "ut.gupta29@gmail.com",
            to: userEmail,
            subject: 'Product Verified',
            text: 'Your Product has been verified successfully.'
        });
 
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}



const verifyProductByAdmin = async (req, res) => {
    try {
        const productId = req.params.id;
            
        const product = await Product.findByIdAndUpdate(productId, { proVerifyByAdmin: true }, { new: true });
       
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const userId = product.userId
  
        const user = await User.findById(userId);
 
   
        await productVerificationEmail(user.email);
        res.json({ message: 'Product verified successfully' });
    } catch (error) {
        console.error('Error verifying Product: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//product Verification end



module.exports = {
    getAllUsers, getUser, deleteUser, updateUser, register,verifyProductByAdmin,getAllSellers,getAllBuyers,getAllSubAdmins
}