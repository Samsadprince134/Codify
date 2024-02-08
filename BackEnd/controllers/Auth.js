const User = require("../models/User");
const OTPGenerate = require("otp-generator");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
let JWT = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
const {passwordUpdated } = require("../mail/templates/passwordUpdate")

// sendOtp controller

exports.sendOtp = async (request, response) => {
  try {
    const { email } = request.body;
    const existOrNot = await User.findOne({Email : email });
    if (existOrNot) {
      return response.status(403).json({
        success: false,
        message: "User Already Registered..",
      });
    }
    // if user not exist
    var otp = OTPGenerate.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Otp Generated is --> ", otp);

    let UniqueOtpOrNot = await Otp.findOne({ otp: otp });
    while (UniqueOtpOrNot) {
      otp = OTPGenerate.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      UniqueOtpOrNot = await Otp.findOne({ otp: otp });
    }

    // create an enrty in DB
    const saveOtp = await Otp.create({ email, otp });

    console.log("Saved entry in DB of OTp is --> ", saveOtp);

    response.status(200).json({
      success: true,
      message: "OTP sent Successfully",
      OTP: otp,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signup controller

exports.signUp = async (request, response) => {
  try {
    // data fetch from request ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      
      otp,
    } = request.body;
    //validate karlo
    console.log("Details are --> " , firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    
    otp,)

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      
      !otp
    ) {
      return response.status(403).json({
        success: false,
        message: "All fields are Required",
      });
    }
    // 2 password ko match karlo

    if (confirmPassword !== password) {
      return response.status(400).json({
        success: false,
        message: "Password doesn't match, please try again",
      });
    }
    // check user already exist or not

    let userExistOrNot = await User.findOne({ Email  : email});
    if (userExistOrNot) {
      return response.status(400).json({
        success: false,
        message: "User Already Regstered..",
      });
    }

    // find most recent otp stored for the user
     console.log(email)
    const recentOtp = await Otp.findOne({ email : email }).sort({ createdAt : -1}).limit(1);
    console.log("Most Recent Otp is -->", recentOtp);
    // validate otp
    console.log(recentOtp);
    if (recentOtp.length === 0) {
      return response.status(400).json({
        success: false,
        message: "OTP not found..",
      });
    } else if (recentOtp.otp !== otp) {
      console.log("Most Recent Otp is -->", recentOtp);
      return response.status(400).json({
        success: false,
        message: "Invalid Otp..",
      });
    }
    // hash password

    let hashPassword = await bcrypt.hash(password, 10);
    // create enrty in db
    const profileDeatils = await Profile.create({
      gender: null,
      dateOfBirth: null,
      contactNumber: null,
      about: null,
    });
    const saveUser = await User.create({
      FirstName : firstName,
      LastName : lastName,
      Email : email,
      Password: hashPassword,
      confirmPassword: hashPassword,
      accountType,
      
      additionalDetails: profileDeatils._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    // return reponse

    response.status(200).json({
      success: true,
      message: "User Register Successfully",
      SavedUser: saveUser,
    });
  } catch (error) {
    console.log(error);
    response.status(400).json({
      success: false,
      message: "User Canot be Registered, Please Try Again",
    });
  }
};

// LogIn Controller....

exports.logIn = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(403).json({
        success: false,
        message: "Please Fill All the Fields",
      });
    }

    let userExistOrNot = await User.findOne({ Email : email }).populate(
      "additionalDetails"
    );

    // user doesnt exist
    if (!userExistOrNot) {
      return response.status(401).json({
        success: false,
        message: "User Not Exist, Plese Sign Up First",
      });
    }

    // user Exist

    let savedPassword = userExistOrNot.Password;
    let cmp = await bcrypt.compare(password, savedPassword);

    if (cmp) {
      payload = {
        email: userExistOrNot.Email,
        id: userExistOrNot._id,
        role: userExistOrNot.accountType,
      };

      let Token = JWT.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      userExistOrNot = userExistOrNot.toObject();
      userExistOrNot.GeneratedToken = Token;
      userExistOrNot.Password = undefined;
      userExistOrNot.confirmPassword = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      response.cookie("Token", Token, options).status(200).json({
        success: true,
        Token,
        userExistOrNot,
        message: "User Logged In Successfully",
      });
    } else {
      response.status(401).json({
        success: false,
        message: "Password is Wrong",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: "Some Error Occured, Please Login Again",
    });
  }
};

// change password controller

exports.changePassword = async (request, response) => {
  try {
    const { oldPassword, NewPassword, confirmNewPassword } = request.body;

    let user = await User.findById({_id : request.user.id});
    if (!user) {
      return response.status(403).json({
        success: false,
        message: "user doesnt exist",
      });
    }
    console.log("user details are -->" , user)
   // const userpassword = user.Password
 
    const cmp = await bcrypt.compare(oldPassword, user.Password)
    console.log(cmp)
  
    if(!cmp){
      return response.status(403).json({
        success: false,
        message: "Old password is wrong",
      });

    }
  
    if (NewPassword.length == 0 || confirmNewPassword.length == 0) {
      return response.status(403).json({
        success: false,
        message: "Field is Empty, please try again",
      });
    }

    if (NewPassword !== confirmNewPassword) {
      return response.status(403).json({
        success: false,
        message: "Password doesnt match please try again",
      });
    }
   
    let updateNewPassword = await bcrypt.hash(NewPassword, 10);
    let updateConfirmNewPassword = await bcrypt.hash(confirmNewPassword, 10);
    let update = await User.findByIdAndUpdate(
      {
        _id: request.user.id,
      },
      {
        Password: updateNewPassword,
        confirmPassword: updateConfirmNewPassword,
      },
      {
        new: true,
      }
    );

    try {
      const body = passwordUpdated(user.Email, user.FirstName)
      let mailSendUpdate = await mailSender(
        user.Email,
        "Codify",
        body
      );

      console.log("Email Sent successfully", mailSendUpdate);
    } catch (error) {
      console.log("Error Occured While Sending Mail", error);
    }

    response.status(200).json({
      success: true,
      UpdatedData: update,
      message: "Password Changed Sucessfully",
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: "Cant Change Password, something went wrong",
      error : error.message
    });
  }
};
