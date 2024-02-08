const nodemailer = require("nodemailer");
require("dotenv").config();
const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      service : 'gmail',
      host: process.env.MAIL_HOST,
      port : 587,
      secure : false,
      
      
    
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
     // debug : true
    });

    // send mail
   // console.log("on the way")
    let info = await transporter.sendMail({
      
      
      from: {
        name : "Codify",
        address : process.env.MAIL_USER

      } ,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
      
    });
   // console.log("INFO --> ", info);
   return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;
