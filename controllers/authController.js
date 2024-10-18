const User = require('../models/userModel');
const Role = require('../models/roleModel');
const UserToken = require('../models/userTokenModel')
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')
const jwt = require('jsonwebtoken')
const nodemailer= require('nodemailer')
//signup
const signup = async (req, res, next) => {
  try {
    const role = await Role.find({ role: 'User' });
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      contactNumber: req.body.contactNumber,
      verifiedByAdmin: false,
      roles: role
    })
    await newUser.save();
   // return res.status(200).json("User Registered Successfully")
   return next(createSuccess(200, "User Registered Successfully"))
  }
  catch (error) {
    //return res.status(500).send("Something went wrong")
    return next(createError(500, "Something went wrong"))
  }
}
//to login

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
      .populate("roles", "role");

    if (!user) {
      return next(createError(404, "User Not Found"));
    }

    // Check if the user is either admin or subadmin
    if (!user.isAdmin && !user.isSubadmin) {
      return next(createError(403, "Access Denied. Admins or Subadmins Only"));
    }

    const isPassword = await User.findOne({ password: req.body.password });
    if (!isPassword) {
      return next(createError(404, "Password is Incorrect"));
    }

    res.cookie('userId', user._id.toString(), { httpOnly: true });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, roles: user.roles },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({
        "userId": user._id,
        "token": token,
        status: 200,
        message: "Login Success",
        data: user
      });
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};


//Register Admin

const registerAdmin = async (req, res, next) => {
  try {
    const role = await Role.find({});
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      contactNumber: req.body.contactNumber,
      isAdmin: true,
      isSeller: false,
      isBuyer: false,
      isSubadmin: false,
      roles: role
    })
    await newUser.save();
    //return res.status(200).send("User Registered Successfully")
    return next(createSuccess(200, "Admin Registered Successfully"))
  }
  catch (error) {
    //return res.status(500).send("Something went wrong")
    return next(createError(500, "Something went wrong"))
  }
}

//register Seller
const registerSeller = async (req, res, next) => {
  try {
    const role = await Role.find({role:"Seller"});
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      contactNumber: req.body.contactNumber,
      isAdmin: false,
      isSeller: true,
      isBuyer: false,
      isSubadmin: false,
      verifiedByAdmin: false,
      roles: role
    })
    await newUser.save();
    //return res.status(200).send("User Registered Successfully")
    return next(createSuccess(200, "Seller Registered Successfully"))
  }
  catch (error) {
    //return res.status(500).send("Something went wrong")
    return next(createError(500, "Something went wrong"))
  }
}

//registerSubAdmin

const registerSubadmin = async (req, res, next) => {
  try {
    const role = await Role.find({role:"Subadmin"});
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      contactNumber: req.body.contactNumber,
      isAdmin: false,
      isSeller: false,
      isBuyer: false,
      isSubadmin: true,
      verifiedByAdmin: false,
      roles: role
    })
    await newUser.save();
    //return res.status(200).send("User Registered Successfully")
    return next(createSuccess(200, "Subadmin Registered Successfully"))
  }
  catch (error) {
    //return res.status(500).send("Something went wrong")
    return next(createError(500, "Something went wrong"))
  }
}


//register Buyer
const registerBuyer = async (req, res, next) => {
  try {
    const role = await Role.find({role:"Buyer"});
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      contactNumber: req.body.contactNumber,
      isAdmin: false,
      isSeller: false,
      isBuyer: true,
      isSubadmin: false,
      verifiedByAdmin: false,
      roles: role
    })
    await newUser.save();
    //return res.status(200).send("User Registered Successfully")
    return next(createSuccess(200, "Buyer Registered Successfully"))
  }
  catch (error) {
    //return res.status(500).send("Something went wrong")
    return next(createError(500, "Something went wrong"))
  }
}
//sendresetmail

const sendEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: { $regex: '^' + email + '$', $options: 'i' } });
if(!user){
  return next(createError(404, "User Not found"))
}
 const payload={
  email:user.email
 }
 const expiryTime = 900;
 const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:expiryTime});
 const newToken = new UserToken({
  userId: user._id,
  token: token
 });
 const mailTransporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"ut.gupta29@gmail.com",
    pass:"yver vjuu fvbb hcot"
   }
 });
 //const resetLink = `http://localhost:4200/reset/${token}`;
 let mailDetails={
  from: "ut.gupta29@gmail.com",
  subject: "Reset Password !",
  to: email,
//  text: `Click the following link to reset your password: ${resetLink}`,
  html: `<html>
  <head>
      <title>Password Reset Request</title>
  </head>
  <body>
      <h1>Password Reset Request</h1>
      <p>Dear ${user.name},</p>
      <p>We have received a request to reset your password for your account with Auction Bidding Application. To complete the password reset process, please click on the button below:</p>
      <a href=${process.env.LIVE_URL}/reset-password/${token}><button style="background-color: #4CAF50; color: white; padding: 14px 20px; border: none;
      cursor: pointer; border-radius: 4px;">Reset Password</button></a>
      <p>Please note that this link is only valid for a <b>15 minutes</b>.
      If you did not request a password reset, please ignore this message.</p>
      <p>Thank you,</p>
      <p>Auction Bidding</p>
  </body>
  </html>`,
 };
 mailTransporter.sendMail(mailDetails,async(err,data)=>{
  if(err){
    console.log(err);
    return next(createError(500, "Something went wrong"))
  }
  else{
  await newToken.save();
  return next(createSuccess(200, "Email Sent Successfully"))
  }
 });
}

// Reset Password
 const resetPassword = (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
      if (err)
      {
          return next(CreateError(500, "Password Reset Link is Expired!"));
      }
      else
      {
          const response = data;
          const user = await User.findOne({ email: { $regex: '^' + response.email + '$', $options: 'i'}});
          user.password = newPassword;
          try
          {
              const updatedUser = await User.findOneAndUpdate(
              { _id: user._id },
              { $set: user },
              { new: true });
              return next(createSuccess(200, "Password Reset Success!"));
          }
          catch (error)
          {
              return next(createError(500, "Something went wrong while resetting the password!"))
          }
      }
  });
}

module.exports = {
  login, registerAdmin,sendEmail,resetPassword,signup,registerSeller,registerBuyer,registerSubadmin
}