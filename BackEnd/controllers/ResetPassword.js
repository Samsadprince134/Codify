
const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto")
// resetpassowrd token

exports.resetPasswordToken = async (request, response) => {
  try {
    // email to diya hi hoga forget password krne ke liye, email fetch karlo
    console.log("request body--->" , request.body)
    const {email}  = request.body
    console.log("email-->" , email)

    // check for email validation

    const user = await User.findOne({ Email : email });
    console.log("User Details : " , user)
    if (!user) {
      return response.status(401).json({
        succcess: false,
        message: "User is not registerd with us, please sign up first",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    // update user by adding token and expire time
    let id = new mongoose.Types.ObjectId(user._id)
    console.log(typeof(user._id))
    console.log(typeof(id))
    const updatedDetails = await User.findOneAndUpdate(
      { Email : email },
       {$push : {token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 } },
      { new : true }
    );
   console.log("Updated Details---->" , updatedDetails)
    //create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail containg url
    await mailSender(
      email,
      "Password Reset Link Codify",
      `password reset link ${url}`
    );
    // return response

    return response.status(200).json({
      success: true,
      message:
        "Email sent succesfully , please check email and change the password ",
    });

    // user exits
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: "something went wrong while forgetting password",
      error : error.message
    });
  }
};

// reset password

exports.resetPassword = async (request, response) => {
  try {
    // data fech
    console.log("token--->" ,request.body )
    const { token, newPassword, confirmnewPassword } = request.body;
    
    // validation
    if (newPassword !== confirmnewPassword) {
      return response.json({
        success: false,
        message: "password doesn't match",
      });
    }
    // get userdetails from db using token
    const user = await User.findOne({ token: token });
    console.log(user)
   
    // if no enrty invalid token
    if (!user) {
      return response.json({
        success: false,
        message: "Invalid Token",
      });
    }
    // token time check
   

    if (user.resetPasswordExpires < Date.now()) {
      return response.json({
        success: false,
        message: "Token is expired, please generate new Token",
      });
    }
    console.log("chalra hai")

    // hash password
   
    let hashPassword = await  bcrypt.hash(newPassword, 10);
    // passowrd update
    const updatedDetails = await User.findOneAndUpdate(
      { token: token },
      { Password: hashPassword },
      { confirmPassword: hashPassword },
      { new: true }
    );

    // return response

    return (
      response.status(200).json({
        success: true,
        message: "Passowrd is Updated",
      })
    );
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error : error.message,
      success: false,
      message:
        "Something went wrong while reseting password, please try again later",
    });
  }
};
