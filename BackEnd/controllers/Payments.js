const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const { findById, findOne } = require("../models/Section");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto")
const CourseProgress = require("../models/CourseProgress")



















exports.capturePayment = async (request, response) => {
  try {
    const { courses } = request.body;
    const userId = request.user.id;

    if (courses.length === 0) {
      return response.json({
        success: false,
        message: "Please Provide Course Id",
      });
    }

    let totalAmount = 0;
    for (const course_id of courses) {
      let course;
      try {
        console.log("id" , course_id)
        course = await Course.findById({ _id : course_id} );
        console.log("Course" , course)
        if (!course) {
          return response.status(200).json({
            success: false,
            message: "Could not find the course",
          });
        }
        const uId = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uId)) {
          return response.status(200).json({
            success: false,
            message: "Student Already Enrolled",
          });
        }
        totalAmount = totalAmount + course.price;
      } catch (error) {
        console.log(error.message);
        return response.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };

    try {
      const paymentResponse = await instance.orders.create(options);
      return response.json({
        success: true,
        message: "Order CreatedSuccessfully",
        data: paymentResponse,
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).json({
        success: false,
        message: "Could no create order",
        error: error.message,
      });
    }
  } catch (error) {
    console.log(error.message);
    return response.status(500).sjon({
      success: false,
      message: "Failed",
      error: error.message,
    });
  }
};




exports.verifySignature = async (request, response) => {
  try {
    const razorpay_order_id = request.body?.razorpay_order_id;
    const razorpay_payment_id = request.body?.razorpay_payment_id;
    const razorpay_signature = request.body?.razorpay_signature;
    const courses = request.body?.courses;
    const userId = request.user.id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return response.status(200).json({
        sucess: false,
        message: "Payment Failed",
      });
    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("Paymemt request ka body " , request.body)
      // mail bhejao succesfull payment ka

      // enroll karao student ko

      await enrollStudents(courses, userId, response);
      //return response
      return response.status(200).json({
        success: true,
        message: "Payment Verified",
      });
    }
    return response.status(400).json({
      success: false,
      message: "Payment Fails",
    });
  } catch (error) {}
};







const enrollStudents = async (courses, userId, response) => {
  try {
    if (!courses || !userId) {
      return response.json({
        success: false,
        message: "Invalid ID's provided",
      });
    }

    for (const course_id of courses) {
      // find the course

      const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: course_id },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
     

      if (!enrolledCourse) {
        return response
          .status(500)
          .json({ success: false, message: "Course not found" });
      }



      // Course.purchaseCount = Course.purchaseCount + 1;
      // await Course.save()



       // course progress me entry create karo
       const createCourseProgress = await CourseProgress.create({userID : userId , courseID : course_id, completedVideos : []})

      

      const studEnroll = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { courses: course_id ,  courseProgess : createCourseProgress._id  } },
        { new: true }
      );


     



      // mail bhejao enrolled student ke liye

      const body = courseEnrollmentEmail(
        enrolledCourse.courseName,
        studEnroll.FirstName
      );

      const emailResponse = await mailSender(
        studEnroll.Email,
        "Congratulations!! Codify",
        body
      );
      console.log("Email sent suuccessfully" , emailResponse)
    }


  } catch (error) {
    return response.status(500).json({
      success : false,
      error : error.message,
      message : "Error aara hai bhai"
    })
  }
};



// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.Email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.FirstName} ${enrolledStudent.LastName}`,
        amount/100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}


















// Ye wala sirf ek Item ke liye hai
//capture the payment and create/initiate the razorpay order

// exports.capturePayment = async (request, response) => {
//   try {
//     // data fetch from request
//     const { courseId } = request.body;
//     const userId = request.user.id;

//     // validation

//     if (!courseId || !userId) {
//       return response.statsu(500).json({
//         success: false,
//         message: "invalid ID's",
//       });
//     }
//     // validation course deatils

//     const courseDetails = await Course.findById({ _id: courseId });
//     if (!courseDetails) {
//       return response.status(400).json({
//         success: false,
//         message: "invalid course details",
//       });
//     }
//     // validation of user details

//     const userDetails = await User.findById({ _id: userId });
//     if (!userDetails) {
//       return response.status(400).json({
//         success: false,
//         message: "invalid User details",
//       });
//     }

//     // check user already paid or not

//     const uID = new mongoose.Types.ObjectId(userId);
//     if (courseDetails.studentsEnrolled.includes(uID)) {
//       return (
//         response.status(400),
//         json({
//           success: false,
//           message: "Student is Already Enrolled",
//         })
//       );
//     }

//     // create order

//     const amount = courseDetails.price;
//     const currency = "INR";
//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt: Math.random(date.now()).toString(),
//       notes: {
//         courseId,
//         userId,
//       },
//     };

//     try {
//       // initiate the payment using razorpay

//       const paymentRazorPay = await instance.orders.create(options);
//       console.log(paymentRazorPay);

//       // return response

//       return response.status(200).json({
//         success: true,
//         courseName: courseDetails.courseName,
//         courseDescription: courseDetails.description,
//         thumbnail: courseDetails.thumbnail,
//         orderId: paymentRazorPay.id,
//         currency: paymentRazorPay.amount,
//         amount: paymentRazorPay.amount,
//       });
//     } catch (error) {
//       return response.status(400).json({
//         success: false,
//         message: "Could not create payment",
//         error: error.message,
//       });
//     }
//   } catch (error) {
//     response.status(500).json({
//       success: false,
//       message: "payment fails",
//       error: error.message,
//     });
//   }
// };

// // verify signature, authorization of razorpay and server
// // this api route will be called by razorpay, not from frontend/postman
// exports.verifySignature = async (request, response) => {
//   try {
//     const webHookSecret = "12345678";

//     const signature = request.headers("x-razorpay-signature");

//     // this signature will be in encrypted format through hashing and hashing cant be dcrypt, so wi have to encrypt our webhooksecret through same setps so we can compare both encrypted strings
//     // find what is checkSum ??
//     // read more in copy about // hashed based message authentication code and SHA(secure hashing algorithm)
//     // No need to know these things in very detail
//     const shasum = crypto.createHmac("sha256", webHookSecret);
//     shasum.update(JSON.stringify(request.body));
//     const digest = shasum.digest("hex");

//     if (signature === digest) {
//       console.log("Payment is Authorized");
//       // paymest sennd mail

//       //   now all thing is done, make student enroll to the course
//       //   request.body.payload.payment.entity.notes
//       //   userId
//       const { courseId, userId } = request.body.payload.payment.entity.notes;

//       try {
//         // fullfill the action , enroll students
//         // find the course and enroll the student in it
//         const enrollCourse = await Course.findOneAndUpdate(
//           { _id: courseId },
//           { $push: { studentsEnrolled: userId } },
//           { new: true }
//         );

//         enrollCourse.purchaseCount = enrollCourse.purchaseCount + 1;

//         if (!enrollCourse) {
//           return response.status(400).json({
//             success: false,
//             message: "Course Not Found",
//           });
//         }

//         console.log(enrollCourse);

//         const enrollUser = await User.findOneAndUpdate(
//           { _id: userId },
//           { $push: { courses: courseId } },
//           { new: true }
//         );

//         console.log(enrollUser);

//         if (!enrollUser) {
//           return response.status(400).json({
//             success: false,
//             message: "User Not Found",
//           });
//         }
//         const body = courseEnrollmentEmail(
//           enrollCourse.courseName,
//           enrollUser.FirstName
//         );

//         const emailResponse = await mailSender(
//           enrollUser.Email,
//           "Congratulations!! StudyNotion",
//           body
//         );
//         console.log("Email Response -- > ", emailResponse);

//         response.status(200).json({
//           success: true,
//           message: "Signature Verifed and COurse Added",
//         });
//       } catch (error) {
//         response.status(400).json({
//           success: false,
//           message: "Failed",
//           error: error.message,
//         });
//       }
//     } else {
//       return response.status(400).sjon({
//         success: false,
//         message: "invalid request",
//       });
//     }
//   } catch (error) {
//     response.status(400).sjon({
//       success: false,
//       message: "Failes",
//       error: error.message,
//     });
//   }
// };
