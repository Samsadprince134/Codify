const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
const  otpTemplate  = require("../mail/templates/emailVerificationTemplate")
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    //expired: 5 * 60,
    expired : 1*1000
    
  },

  otp: {
    type: String,
    required: true,
  },
});

// pre middleware for verification of mail before making enrty into the DATABASE

async function sendVerificationEmail(email, otp) {
  try {
    const body = otpTemplate(otp);
    const mailResponse = await mailSender(
      email,
      "Verification Email From Codify",
      body
    );
    console.log("Email Sent successfully", mailResponse);
  } catch (error) {
    console.log("Error occured while sending mail --> ", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("Otp", otpSchema);
