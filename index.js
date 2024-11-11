require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
// const multer = require('multer')
// const path= require('path')
// const companyLoginRoutes = require('./routes/companyLoginRoutes')
const roleRoute = require('./routes/roleRoute')
const authRoute = require('./routes/authRoute')
const buyerRoute = require('./routes/buyerRoute')
const userRoute = require('./routes/userRoute')
const bidRoute = require('./routes/bidRoute')
const helpRoutes = require('./routes/helpRoutes')
const howToSellRoutes = require('./routes/howToSellRoute');
const howToBuyRoutes = require('./routes/howToBuyRoute');
const emailTemplateRoutes = require('./routes/emailTemplateRoutes');
const bodyParser = require('body-parser')
const itemInventoryRoute = require('./routes/itemInventoryRoute')
const sellerProductRoute = require('./routes/sellerProductRoutes')
const adminRoutes = require('./routes/adminRoute');
const categoryRoutes = require('./routes/categoryRoutes');
const dropdownRoute =require('./routes/dropDownRoutes')
const adminSettingsRoutes = require('./routes/adminSettingsRoutes');
const requestRoute = require('./routes/requestRoute');
const termsRoute = require('./routes/termsRoute');
const privacyRoute = require('./routes/privacyRoute');
const orderRoutes = require('./routes/orderRoutes');
const countryRoute = require('./routes/countryRoute');
const bannerRoutes = require('./routes/homeBannerImageRoute');
const aboutRoute = require('./routes/aboutRoute');
const transactionRoutes = require('./routes/transactionRoutes');

// const errorMiddleware = require('./middleware/errorMiddleware')
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL
const FRONTEND = process.env.FRONTEND
const cookieParser = require('cookie-parser')
var cors = require('cors')
var app = express();
var corsOptions = {
    origin: FRONTEND,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    Credentials: true
}
app.use(bodyParser.json({ limit: '50mb' })); // To handle large JSON payloads if needed
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use('/api/login', companyLoginRoutes)
//to create roles
app.use('/api/role', roleRoute)
//to register and login
app.use('/api/auth', authRoute)
//to list users
app.use('/api/user', userRoute)
// to add iteminventory
app.use('/api/item', itemInventoryRoute)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//to use sellerproduct
app.use('/api/product', sellerProductRoute)
//buyer
app.use('/api/bids',bidRoute );
//admin
app.use('/api/admin', adminRoutes);
app.use('/api/adminSettings', adminSettingsRoutes);
//to use dropdown
app.use('/api/dropdown', dropdownRoute)
app.use('/api/buyer',buyerRoute)
app.use('/api/categories', categoryRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/sell', howToSellRoutes);
app.use('/api/buy', howToBuyRoutes);
app.use('/api/request', requestRoute);
app.use('/api/terms', termsRoute);
app.use('/api/about', aboutRoute);
app.use('/api/privacy', privacyRoute);
app.use('/api', emailTemplateRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/country', countryRoute);
app.use('/api/banner', bannerRoutes);
app.use('/api', transactionRoutes);
//app.use('/uploads/uploadDocuments', express.static(path.join(__dirname, 'uploads/uploadDocuments')));
//Response handler Middleware

app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong!";
    return res.status(statusCode).json({
        success: [200, 201, 204].some(a => a === obj.status) ? true : false,
        status: statusCode,
        message: message,
        data: obj.data
    })
})
// app.use(errorMiddleware);

//database connect

mongoose.set("strictQuery", false)
mongoose.
    connect(MONGO_URL)
    .then(() => {
        console.log('connected to MongoDB')
        app.listen(PORT, () => {
            console.log(`Node API app is running on port ${PORT}`)
        });
    }).catch((error) => {
        console.log(error)
    })
