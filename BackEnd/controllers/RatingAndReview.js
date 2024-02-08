const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");
const Course = require("../models/Course");

// create review
exports.createRating = async (request, response) => {
  try {
    const { rating, review, courseId } = request.body;
    const userId = request.user.id;
  //  console.log(rating, review, courseId)

    const courseDetails = await Course.findById({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
   // console.log(rating, review, courseId)
    if (!courseDetails) {
      return response.status(400).json({
        success: false,
        message: "Student not enrolled in the course",
      });
    }

    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    console.log(alreadyReviewed)
    
    if (alreadyReviewed) {
      return response.status(200).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }
  
    console.log(userId, courseId)
    console.log(userId, courseId)

    const saverating = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating,
      review,
    });
    const updateCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { ratingAndReviews: saverating._id } },
      { new: true }
    );
    response.status(200).json({
      success: true,
      message: "Review Done!!",
      saverating: saverating,
      updateCourse: updateCourse,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: "review fails!!",
      error: error.message,
    });
  }
};

// Get Average Rating

exports.averageRatings = async (request, response) => {
  try {
    const { courseId } = request.body;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
        $group: {
          _id: null,
          averageRating: { $avg: "rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return response.status(200).json({
        success: true,
        message: "All Review fetched",
        AverageRating: result[0].averageRating,
      });
    }
    return response.status(200).json({
      success: true,
      message: "Average rating is zero, no reviews",
      AverageRating: 0,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: "cant calculate average rating",
      error: error.message,
    });
  }
};

// get all rating and review of a particular course

exports.getAllRatingOfCourse = async (request, response) => {
  try {
    const { courseId } = request.body;
    const allRating = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
        $group: {
          _id: null,
          AllRating: "rating",
        },
      },
    ]);
    response.status(200).json({
      success: true,
      message: "All rating fetched for this course",
      ALLRATINGS: allRating[0].AllRating,
    });
  } catch (error) {
    response.status(400).json({
      sucess: false,
      message: "failled",
      error: error.message,
    });
  }
};





// get all/complete rating and review

exports.getAllRating = async (request , response) => {
  try {

    const ratings = await RatingAndReview.find({}).sort({rating : "desc"}).populate({
      path : "user",
      select : "FirstName LastName Email image"
    }).populate({
      path : "course",
      select : "courseName"
    })
     
    return response.status(200).json({
      success : true,
      message : "All rating fetched",
      data: ratings


    })

  }
  catch(error){
    response.status(400).json({
      success : false,
      message : "error in fetching all rating",
      error : error.message
    })

  }
}

