const Course = require("../models/Course");
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Tag = require("../models/Category");
const User = require("../models/User");
const { convertSecondsToDuration } = require("../utils/secToDuration")
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const Category = require("../models/Category");
require("dotenv").config();

// Create Course Handler Function

exports.createCourse = async (request, response) => {
  try {
    // fetch data
    console.log("in bacend course api")
    let { courseName, description, whatYouWillLearn, price, category , status,
      instructions, tag} =
      request.body;
console.log("All data is ---> " ,  courseName, description, whatYouWillLearn, price, category , status,
instructions, tag)
    // fetch thumbnail

    const  thumbnail  = request.files.thumbnailImage;
    console.log("Thumbnail is ----> ", thumbnail)



     // Convert the tag and instructions from stringified Array to Array
     tag = tag ? JSON.parse(tag) : []
     instructions = instructions ? JSON.parse(instructions) : []

     console.log("tag", tag)
     console.log("instructions", instructions)

    // validation

    if (!courseName || !description || !whatYouWillLearn || !price  || !category || !tag.length || !instructions.length) {
      return response.status(400).json({
        success: false,
        message: "All Feilds Are Manadatory",
      });
    }

    if (!status || status === undefined) {
      status = "Draft"
    }

    // instructor validation, but why?? middleware me to check kar liya hoga na already
    const userId = request.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details are -->", instructorDetails);
    if (!instructorDetails) {
      return response.status(400).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // check Given Category is value or not

    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
      return response.status(400).json({
        success: false,
        message: "Category Details not found",
      });
    }

    // upload image to cloudinary
    const uploadthumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

    // Create an entry in db for new course;

    const newCourse = await Course.create({
      courseName,
      description,
      whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      instructor: instructorDetails._id,
      thumbnail: uploadthumbnailImage.secure_url,
      status: status,
      instructions,
      
    });

    // add the new course to userschema for a instructor..
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // update the category schema

    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      { $push: { course: newCourse._id } },
      { new: true }
    );

    //  return response
    response.status(200).json({
      success: true,
      message: "Course Created Successfuly",
      data: newCourse,
    });
  } catch (error) {
    console.log("Error in creating course -->", error);

    response.status(500).json({
      success: false,
      message: "Failed, Course cant be Create, something went wrong",
      error :error.message
    });
  }
};

// getAll courses Handler Functiion

exports.getAllCourses = async (request, response) => {
  try {
    const allCourseData = await Course.find({});

    return response.status(200).json({
      success: true,
      message: "all Course data fetched",
      data: allCourseData,
    });
  } catch (error) {
    console.log("Error in creating course -->", error);

    response.status(500).json({
      success: false,
      message: "Failed, cannot fetch all course data",
      error: error.message,
    });
  }
};



// Get All details with all popuated IDs

exports.getAllCoursesDetails = async (request , response) => {
  try {

    const {courseId} = request.body;

    const courseDetails = await Course.findById({_id : courseId}).populate({
      path: 'instructor',
      populate: {
        path: 'additionalDetails'
      }
    })
    .populate('category')
    .populate('ratingAndReviews')
    .populate({
      path: 'courseContent',
      populate: {
        path: 'subSection',
        options: { strictPopulate: false }
      }
    }).exec()

    if(!courseDetails){
      return response.status(400).json({
        success : false,
        message : "Could not fine course details"
      })
    }


response.status(200).json({
  success : true,
  message : "course detail fethed successsfuly",
  courseDetails : courseDetails
})

  }
  catch(error){
    response.status(400).json({
      success : false,
      message : "something went wrong in fetching course details",
      error : error.message,
    })

  }
}






// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    console.log("in edit course api")
    const { courseId } = req.body
   
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}




exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}










// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
























exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

