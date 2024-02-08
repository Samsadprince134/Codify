const mailSender = require("../utils/mailSender");
const {contactUsEmail} = require("../mail/templates/contactFormRes");
require("dotenv").config();

exports.contactUs = async (request , response) => {
    try {
        const { email, firstname, lastname, message, phoneNo, countrycode } = request.body

        if(!email || !firstname || !message || !phoneNo || !countrycode) {
            return response.status(400).json({
                success : false,
                message : "All Fields Are required"
            })
        }
        const body = contactUsEmail( email,firstname,lastname,message,phoneNo,countrycode);
           await  mailSender(process.env.MAIL_USER , "User Response" , body);
           await mailSender(email , "Your Response sent Successfully" , body);

           response.status(200).json({
            success : true,
            message : "Success"
           })
           


    }
    catch(error){
        response.status(400).json({
            success : false,
            message : "failed in contacting",
            error : error.message
        })

    }
}