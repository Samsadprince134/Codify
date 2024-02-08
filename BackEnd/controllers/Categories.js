const Category = require("../models/Category");
const Course = require("../models/Course");
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

// create category ka API HAndler Function...

exports.createCategory = async (request, response) => {
  try {
    // fetch data
    const { name, description } = request.body;

    // validation
    if (!name || !description) {
      return response.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create enrty in DB

    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });

    console.log(categoryDetails);
    return response.status(200).json({
      success: true,
      message: "Category Created Successfully",
      CategoryDetails: categoryDetails,
    });
  } catch (error) {
    console.log("Error in Creating a Category", error);
    response.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

//  fetch all the category

exports.showAllCategories = async (request, response) => {
  try {
    
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );

    console.log(allCategories);
    return response.status(200).json({
      success: true,
      message: "All Category fetched",
      data: allCategories,
    });
  } catch (error) {
    console.log("Error in Showing all the categories", error);
    response.status(500).json({
      sucess: false,
      message: error.message,
      
    });
  } 
};

// category page details

// exports.categoryPageDetail = async (request, response) => {
//   try {
//     // get category id

//     const { categoryId } = request.body;
//     // fetch all courses for that particular category
//     const courses = await Category.findById({ _id: categoryId })
//       .populate("course")
//       .exec();
//     // validation
//     if (!courses) {
//       return response.status(400).json({
//         success: false,
//         message: "Courses Not Found",
//       });
//     }
//     // get courses for different categories
//     const allDifferentCourses = await Category.find({
//       _id: { $ne: categoryId },
//     })
//       .populate("course")
//       .exec();

//     // get top  10 selling courses
//     const topTenCourse = await Course.find({})
//       .sort({ purchaseCount: -1 })
//       .limit(10);

//     // return response

//     return response.status(200).json({
//       success: true,
//       message: "success",
//       courses: courses,
//       allDifferentCourses: allDifferentCourses,
//       topTenCourse: topTenCourse,
//     });
//   } catch (error) {
//     response.status(400).json({
//       success: false,
//       message: "Failed",
//       error: error.message,
//     });
//   }
// };





exports.categoryPageDetail = async (req, res) => {
  try {
    const { categoryId } = req.body
    console.log("PRINTING CATEGORY ID: ", categoryId);
    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "course",
        match: { status: "Published" },
        populate:{ path : "ratingAndReviews",},
        
      
      }).populate({
        path : "course",
        match : { status: "Published" },
        populate : {path : "instructor"}
      }).exec()

    //console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }
    // Handle the case when there are no courses
    if (selectedCategory.course.length === 0) {
      console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    ).populate({
        path: "course",
        match: { status: "Published" },
        populate:{ path : "ratingAndReviews",},
      }).populate({
        path : "course",
        match : { status: "Published" },
        populate : {path : "instructor"}
      }).exec()
      
      //console.log("Different COURSE", differentCategory)
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: {
          path: "instructor",
      },
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.course)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)
     // console.log("mostSellingCourses COURSE", mostSellingCourses)
    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}