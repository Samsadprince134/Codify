const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const { convertSecondsToDuration } = require("../utils/secToDuration")
const Profile = require("../models/Profile");
const User = require("../models/User");
const cron = require("node-cron");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress")

exports.updateProfile = async (request, response) => {
  try {
    const {
      FirstName = "",
      LastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = request.body
    const id = request.user.id

    // Find the profile by id
    const userDetails = await User.findById(id)
    const profile = await Profile.findById(userDetails.additionalDetails)

    const user = await User.findByIdAndUpdate(id, {
      FirstName,
      LastName,
    })
    await user.save()

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender

    // Save the updated profile
    await profile.save()

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return response.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    console.log(error)
    return response.status(500).json({
      success: false,
      error: error.message,
    })
  }
};








// DeleteAccount Function Handler

exports.deleteAccount = async (request, response) => {
  try {
    const userId = request.user.id;
   

    const userDetails = await User.findById({ _id : userId });
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById({_id :  profileId });
    if (!userDetails || !profileDetails) {
      return response.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }
          // unenroll user from all enroll courses
         // explore how can we schedule this deletion
        // what is chrone job??
        const enrolledCoursesID = userDetails.courses;
        console.log(typeof(enrolledCoursesID))
      //  const enrollDetail = Course.studentsEnrolled;
        for(let i = 0 ;i < enrolledCoursesID.length;i++){
               const unenrollCourse = await Course.findByIdAndUpdate({_id : enrolledCoursesID[i]}, {$pull : {Course : {studentsEnrolled : userId}  }}, {new : true})
        }

         

    const deleteProfile = await Profile.findByIdAndDelete({ _id : profileId });
    const deleteUser = await User.findByIdAndDelete({ _id : userId });


    return response.status(200).json({
      success: true,
      message: "Profile Deleted Successfully",
      deleteProfile: deleteProfile,
      deleteUser: deleteUser,
    });
  } catch (error) {
    return response.status(400).json({
        sucess : false,
        message : "profile cant be deleted",
        error : error.message

    })
  }
};



// getAllUserDetails controller

exports.getAllUserDetails = async (request , response) => {
  try{

    const userId = request.user.id;
    const userDetails = await User.findById({_id : userId}).populate("additionalDetails");
    if(!userDetails){
      return response.status(400).json({
        success : false,
        message : "User doesnt exist"
      })

    }

   // const ProfileId = userDetails.additionalDetails

    //const profileDetails = await Profile.findById({ProfileId });

    return response.status(200).json({
      success : true,
      message : "User data fetched",
      userDetails: userDetails,
      

    })

    
  }
  catch(error){
    return response.status(400).json({
      success : false,
      message : "data fetched fails" ,
      error : error.message
    })

  }
}




exports.updateProfilePicture = async (request , response) => {
  try {
  
    const imageUrl = request.files.imageurl
    const userId = request.user.id;

    //const userDetails = await findById({_id : userId});
   // const profileid = userDetails.additionalDetails;
    
    const imagedetails = await uploadImageToCloudinary(imageUrl , process.env.FOLDER_NAME);
    console.log("in update profile picture API")
    console.log(imagedetails.secure_url)
    const update = await User.findByIdAndUpdate({_id : userId} ,  {image : imagedetails.secure_url} );
    console.log("update", update)
    return response.status(200).json({
      success : true,
      message : "profile picture updated",
      data : update
    })




  }
  catch(error){
    response.status(400).json({
      success : false,
      message : "failed",
      error : error.message
    })

  }
}






exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    console.log("user ID" , userId)
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
   userDetails = userDetails.toObject()
   var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userID: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}





exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.description,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}