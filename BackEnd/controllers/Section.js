const Section = require("../models/Section");
const Course = require("../models/Course");
const User = require("../models/User");

// create function handler

exports.createSection = async (request, response) => {
  try {
    // fetch data
    const { sectionName, courseId } = request.body;

    // validation

    if (!sectionName || !courseId) {
      return response.status(400).json({
        success: false,
        message: "Field is empty",
      });
    }

    // create section and save into DB
    const saveSection = await Section.create({ sectionName: sectionName });

    // update course content in course model by section ID
    const courseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { courseContent: saveSection._id } },
      { new: true }
    )

    const updateCourse = await Course.findById({_id : courseId }).populate({
      path : "courseContent",
      populate : {
        path : "subSection"
      }
    })

   // .populate({ path: "courseContent", populate: { path: "SubSection" } }, ).exec();

    return response.status(200).json({
      success: true,
      message: "Section Created Sucessfully",
      Sectiondata: saveSection,
      updatedCourse: updateCourse,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: "Some error while creating a section",
      error: error.message,
    });
  }
};




















//  Update section

exports.updateSection = async (request, response) => {
  try {
    // fetch data
    const { sectionId, sectionName, courseId } = request.body;

    // data validation

    if (!sectionId || !sectionName) {
      return response.status(400).json({
        success: false,
        message: "Section Updation failed",
      });
    }

    // update data

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { sectionName: sectionName },
      { new: true }
    );


    const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();
    // return response
    return response.status(200).json({
      success: true,
      message: "Section Updated",
      data: course,
    });
  } catch (error) {
    return (
      response.status(400).
      json({
        success: false,
        message: "cant Update Section",
        error: error.message,
      })
    );
  }
};
























// delete Section
exports.deleteSection = async (request, response) => {
  try {
    const { sectionId, courseId } = request.body;

    if (!sectionId) {
      return response.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const updatedDection = await Section.findByIdAndDelete({ _id: sectionId });

    const updatedCOurse = await Course.findByIdAndUpdate(
      { _id: courseId},
      { $pull: { courseContent : updatedDection._id },  } , {new : true}
    ).populate({
      path : "courseContent",
      populate:{
				path:"subSection",
			},
     
    }).exec();
    return response.status(200).json({
        success : true,
        message : "Section Deleted Successfully",
        data  : updatedCOurse ,

    })
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Failed, Cant delete Section",
      error: error.message,
    });
  }
};
