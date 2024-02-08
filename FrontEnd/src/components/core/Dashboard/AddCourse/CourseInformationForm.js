import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchCourseCategories } from "../../../services/operations/courseDetailsAPI";
import { FaRupeeSign } from "react-icons/fa";
import ChipInput from "./ChipInput";
import UploadThumbnail from "./UploadThumbnail ";
import RequirementField from "./RequirementField";
import { setStep } from "../../../slices/courseSlice";
import Iconbtn from "../../../common/Iconbtn";
import { MdNavigateNext } from "react-icons/md";
import { COURSE_STATUS } from "../../../../utils/constants";
import { addCourseDetails } from "../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../slices/courseSlice";
import { editCourseDetails } from "../../../services/operations/courseDetailsAPI";
import toast from "react-hot-toast";
export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const [CategoryResponse, setCategoryresponse] = useState(null);
  const { token } = useSelector((state) => state.auth);


  
  async function fetchCategoryDetails() {
    try {
      setloading(true);
      const response = await fetchCourseCategories();
      console.log("Category response--->", response);
      setCategoryresponse(response);
      setloading(false);
    } catch (error) {
      console.log("Error in fetching category", error.message);
      setloading(false);
    }
  }



  useEffect(() => {
    if (editCourse) {
      console.log("course tags" , course.tag)
     

      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.description);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseimage", course.thumbnail);
      
    }

    fetchCategoryDetails();
  }, []);



  const isFormUpdated = () => {
    const currentValues = getValues();
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseimage !== course.thumbnail
    ) {
      return true;
    }
    return false;
  };




  async function onSubmit(data) {
    console.log("final data -------->", data);

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();
        // console.log(data)
        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("description", data.courseShortDesc);
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory);
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseimage);
        }
        // console.log("Edit Form data: ", formData)
        setloading(true);
        const result = await editCourseDetails(formData, token);
        setloading(false);
        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("description", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("thumbnailImage", data.courseimage);
    setloading(true);

    const result = await addCourseDetails(formData, token);
    console.log("final result -->", result);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setloading(false);
  }

  return (
    <form
     className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col space-y-2">
        <label
          htmlFor="courseTitle"
          className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"
        >
          Course Title <sup className="text-pink-200">**</sup>
        </label>
        <input
          type="text"
          id="courseTitle"
          placeholder="Course Title"
          {...register("courseTitle", { required: true })}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className=" form-style w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
        ></input>
        {errors.courseTitle && (
          <span className="text-xs text-pink-200">
            Course Title is Required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="courseShortDesc"
          className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"
        >
          Course description <sup className="text-pink-200">**</sup>
        </label>
        <textarea
          type="text"
          id="courseShortDesc"
          placeholder="Course Description"
          {...register("courseShortDesc", { required: true })}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className=" min-h-[140px] w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
        ></textarea>
        {errors.courseTitle && (
          <span className="text-xs text-pink-200">
            Course Description is Required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2 relative">
        <label
          htmlFor="coursePrice"
          className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"
        >
          Course Price <sup className="text-pink-200">**</sup>
        </label>
        <input
          type="text"
          id="coursePrice"
          placeholder="Course Price"
          {...register("coursePrice", { required: true, valueAsNumber: true })}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] px-[25px] text-richblack-5"
        ></input>
        <FaRupeeSign className="absolute top-10 left-2 text-richblack-100 " />
        {errors.coursePrice && (
          <span className="text-xs text-pink-200">
            Course Price is Required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="courseCategory"
          className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"
        >
          Course Category <sup className="text-pink-200">**</sup>
        </label>
        <select
          id="courseCategory"
          defaultValue=""
          {...register("courseCategory", { required: true })}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px]  text-richblack-5"
        >
          <option value="" disabled>
            Choose A Category
          </option>
          {!loading &&
            CategoryResponse &&
            CategoryResponse.map((category, index) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.message && (
          <span className="text-xs text-pink-200">Category is Required</span>
        )}
      </div>

      {/* create a custom tag */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and Press Enter"
        register={register}
        error={errors}
        setValue={setValue}
        getValues={getValues}
      ></ChipInput>

      {/* uploading Thumbnail */}
      <UploadThumbnail
        label="Thumbnail"
        name="courseimage"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        editData={editCourse ? course?.thumbnail : null}
      ></UploadThumbnail>

      <div>
        <label
          htmlFor="courseBenefits"
          className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"
        >
          Benefits of the Course <sup className="text-pink-200">**</sup>
        </label>
        <textarea
          type="text"
          id="courseBenefits"
          placeholder="Benefits of the Course"
          {...register("courseBenefits", { required: true })}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className=" min-h-[120px] w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
        ></textarea>
        {errors.courseBenefits && (
          <span className="text-xs text-pink-200">
            Course Benefits Required
          </span>
        )}
      </div>

      <RequirementField
        name="courseRequirements"
        label="Requiremenst/Instructions"
        register={register}
        error={errors}
        setValue={setValue}
        getValues={getValues}
      ></RequirementField>

      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <Iconbtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </Iconbtn>
      </div>
    </form>
  );
}
