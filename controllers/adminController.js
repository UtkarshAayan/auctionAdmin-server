const Product = require('../models/sellerProductFormModel');
const User = require('../models/userModel'); 
const Sequence = require('../models/lotSequenceModel');
const nodemailer = require('nodemailer');

// Nodemailer configuration
const proTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Function to send product verification email
const productVerificationEmail = async (userEmail, lotNumber) => {
    try {
        const info = await proTransporter.sendMail({
            from: process.env.SMTP_USER,
            to: userEmail,
            subject: 'Product Verified',
            text: `Your Product has been verified successfully. Lot Number: ${lotNumber}`
        });
      
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

// Function to get and increment the sequence number
const getNextSequence = async (name) => {
    const sequence = await Sequence.findOneAndUpdate(
        { name },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );
    return sequence.value;
};

// Function to generate lot number
const generateLotNumber = async () => {
    const year = new Date().getFullYear().toString().slice(-2); // Get last two digits of the year
    const sequenceNumber = await getNextSequence('productLotNumber');
    const paddedSequence = sequenceNumber.toString().padStart(5, '0'); // Pad sequence number with leading zeros
    return `Lot-${year}${paddedSequence}`;
};

// Verify product by admin and generate lot number
const verifyProductByAdmin = async (req, res, next) => {
    try {
        const productId = req.params.id;
        
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            console.error(`Product with ID ${productId} not found`);
            return res.status(404).json({ error: 'Product not found' });
        }
        
        product.proVerifyByAdmin = true;
        product.lotNumber = await generateLotNumber(); // Generate the lot number
        await product.save();

        const user = await User.findById(product.userId);
        if (!user) {
            console.error(`User with ID ${product.userId} not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        await productVerificationEmail(user.email, product.lotNumber); // Include lot number in the email

        res.json({ message: 'Product verified successfully', lotNumber: product.lotNumber });
    } catch (error) {
        console.error('Error verifying Product: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//user Verification
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "ut.gupta29@gmail.com",
        pass: "yver vjuu fvbb hcot"
    }
});


const sendVerificationEmail = async (userEmail) => {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: "ut.gupta29@gmail.com",
            to: userEmail,
            subject: 'Account Verified',
            text: 'Your account has been verified successfully.'
        });
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}



const verifyUserByAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndUpdate(userId, { verifiedByAdmin: true }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await sendVerificationEmail(user.email);
        res.json({ message: 'User verified successfully' });
    } catch (error) {
        console.error('Error verifying user: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { verifyProductByAdmin,verifyUserByAdmin };
