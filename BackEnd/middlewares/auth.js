const JWT = require("jsonwebtoken");
require("dotenv").config();
// auth

exports.auth = async (request, response, next) => {

  try {
    let token =
      request.cookies.Token ||
      request.body.token ||
      request.header("Authorization").replace("Bearer ", "");
     

    if (token) {
      try {
        let decode = await JWT.verify(token, process.env.JWT_SECRET);
        console.log(decode);
        request.user = decode;
       // console.log(request)
    
   // console.log("Hello next")
   console.log("in auth api" , token)
    next();
      }  catch (error) {
        return response.status(400).json({
          success: false,
          message: "token is invalid",
          error : error.message
        });
      }
    } else {
      return response.status(401).json({
        success: false,
        message: "token is missing",
      });
    }

    
  } 
  catch (error) {
    console.log(error);
    response.status(400).json({
      success: false,
      message: "Something went wrong, authorization fails",
    });
  }
};

// isStudent

exports.isStudent = async (request, response, next) => {
  try {
    if (request.user.role !== "Student") {
      return response.status(401).json({
        success: false,
        message: "This is a protected route for students only",
      });
    }
    next();
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "User role cannot be verified, try again",
    });
  }
};

//isInstructor

exports.isInstructor = async (request, response, next) => {
  try {
    if (request.user.role !== "Instructor") {
      return response.status(401).json({
        success: false,
        message: "This is a protected route for instructor only",
      });
    }
    next();
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "User role cannot be verified, try again",
    });
  }
};

//isAdmin

exports.isAdmin = async (request, response, next) => {
  try {
    if (request.user.role !== "Admin") {
      return response.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "User role cannot be verified, try again",
    });
  }
};
