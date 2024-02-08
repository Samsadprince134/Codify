
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const {uploadImageToCloudinary} = require("../utils/imageUploader");
// create Sub Section Handler

exports.createSubSection = async (request, response) => {
  try {
    // fetch data
    const { title, description, sectionID, CoursId } = request.body;
    const  videoUrl  = request.files.video;

    // validation

    if (!sectionID || !title || !description  || !videoUrl) {
      return response.status(400).json({
        success: false,
        message: "All Fields Are Required",
        title, description, sectionID ,videoUrl 
      });
    }

    // upload video

    const uploadVideo = await uploadImageToCloudinary(videoUrl,process.env.FOLDER_NAME);

    // create enrty in entry in DB

    const saveSubsection = await SubSection.create({
      title,
      description,
      timeDuration: `${uploadVideo.duration}`,
      videoUrl: uploadVideo.secure_url,
    });

    // update section
    const updateSection = await Section.findByIdAndUpdate(
      { _id: sectionID },
      { $push: { subSection: saveSubsection._id } },
      { new: true }
    )
      .populate("subSection")
      .exec();



      // course

      const courseData = await  Course.findById({_id : CoursId}).populate({
        path : "courseContent",
        populate : {
          path : "subSection"
        }
      })

    // return reponse

    return response.status(200).json({
      success: true,
      message: "subSection Created Successfully",

      data : courseData
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: "Some thing went wrong while creating a subsection",
      error: error.message,
    });
  }
};

// update SubSection Handler

// exports.updateSubSection = async (request, response) => {
//   try {
//     const { sectionID, title, description, subSectionID } =
//       request.body;
//     const videoUrl  = request.files.video;

//     if (
//       !sectionID ||
//       !title ||
//       !description ||
    
//       !videoUrl ||
//       !subSectionID
//     ) {
//       return response.status(400).json({
//         success: false,
//         message: "All Fields Are Required",
//         sectionID, title, description,subSectionID ,videoUrl
//       });
//     }

//     const uploadVideo = await uploadImageToCloudinary(
//       videoUrl,
//       process.env.FOLDER_NAME
//     );

//     const updatedSubSection = await SubSection.findByIdAndUpdate(
//       { _id: subSectionID },
//       { title, description,  timeDuration: `${uploadVideo.duration}`, videoUrl: uploadVideo.secure_url },
//       { new: true }
//     );

//     const updatedSection = await Section.findById({_id : sectionID}).populate("subSection").exec()
//     return response.status(200).json({
//       success: true,
//       message: "sub section updated sucessfully",
//       updatedSection: updatedSection,
//     });
//   } catch (error) {
//     return response.status(400).json({
//       success: false,
//       message: "subsection updation fails",
//       error: error.message,
//     });
//   }
// };


exports.updateSubSection = async (req, res) => {
  try {
    const { sectionID, subSectionID, title, description , CoursId } = req.body
    const subSection = await SubSection.findById(subSectionID)
  console.log("Course Id     --------> " , sectionID, subSectionID, title, description , CoursId )
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionID).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    // course

    const courseData = await  Course.findById({_id : CoursId}).populate({
      path : "courseContent",
      populate : {
        path : "subSection"
      }
    })


    return res.json({
      success: true,
      message: "Section updated successfully",
      updatedSection,
      data : courseData
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
      error : error.message
    })
  }
}
// delete Subsection handler

exports.deleteSubSection = async (request, response) => {
  try {
    const { subSectionID, sectionID, courseId } = request.body;
  console.log(subSectionID  , "gap" ,  sectionID)
    const subsectionDetails = await SubSection.findById({ _id: subSectionID });
    if (!subSectionID || !subsectionDetails) {
      return response.status(500).json({
        success: false,
        message: "subsection is invalid",
      });
    }

    const deletesubsection = await SubSection.findByIdAndDelete({ _id: subSectionID });

    const updateSection = await Section.findByIdAndUpdate(
      { _id: sectionID },
      { $pull: { subSection: deletesubsection._id } },
      { new: true }
    ).populate("subSection");


    const courseData = await  Course.findById({_id : courseId}).populate({
      path : "courseContent",
      populate : {
        path : "subSection"
      }
    })
    return response.status(200).json({
      success: true,
      message: "SubSection Deleted Successfully",
      deletedsubSection: deletesubsection,
      Updatedsection: updateSection,
      data : courseData
    });
  } catch (error) {
    return (
      response.status(400).
      json({
        success: false,
        message: "subsection deletion fails",
        error: error.message,
      })
    );
  }
};
