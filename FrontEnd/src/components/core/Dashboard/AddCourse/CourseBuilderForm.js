import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { IoMdAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import NestedView from "./NestedView";
import { MdNavigateNext } from "react-icons/md";
import { setCourse, setEditCourse, setStep } from "../../../slices/courseSlice";
import toast from "react-hot-toast";
import { createSection, updateSection } from "../../../services/operations/courseDetailsAPI";

export default function CourseBuilderForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues
  } = useForm();
  const [editSection,  setEditSection] = useState(null)
  const [loading ,  setLoading] = useState(false)
  const {course} = useSelector((state) => state.course)
  const {token} = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  
  function cancelEdit(){
    setEditSection(null);
    setValue("sectionName" , "")
  }
  function goBack(){
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  
  }
  function goNext(){
    if(course.courseContent.length === 0){
      toast.error("Please add atleast one section")
      return
    }
    if(course.courseContent.some((section) => section.subSection.length === 0)){
      toast.error("Please add atleast one lecture")
      return
    }
    dispatch(setStep(3))
  }

  function handleChangeEditSectionName(sectionId , sectionName){
    if(editSection === sectionId){
           cancelEdit();
           return
    }
    setEditSection(sectionId);
    setValue("sectionName" , sectionName)
  }
  async function submitHandler(data){
    setLoading(true)
    let result;
    if(editSection){
        // we are editing the section name
        result  = await updateSection(
          {
            sectionName : data.sectionName,
            sectionId : editSection,
            courseId : course._id
          }, token
          )
    }
    else{
      result = await createSection(
        {
          sectionName : data.sectionName,
          courseId : course._id
        }, token
        )
    }

    if(result){
      dispatch(setCourse(result));
      setEditSection(null)
      setValue("sectionName" , "")
    }
        
  }
  return (
    <div>
      <div className="space-y-4 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">
          Course Builder
        </h1>
        <form onSubmit={handleSubmit(submitHandler)}>
          <label
            htmlFor="sectionName"
            className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"
          >
            Section Name <sup className="text-pink-200">**</sup>
          </label>
          <input
            type="text"
            id="sectionName"
            placeholder="Add Section to Build Your Course"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className=" form-style w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
            {...register("sectionName", { required: true })}
          ></input>
          {errors.sectionName && <span className="text-xs text-pink-200">Section Name is Required</span>
          }

          <div className="flex mt-4 gap-4 items-end">

          
          <div className="flex items-center gap-1  border border-yellow-50 w-max py-2 px-4 rounded-md bg-richblack-900">

        
          <button className="text-1xl text-yellow-50 font-semibold">
          {
            editSection ? <p>Edit Section Name</p> : <p>Create Section</p>
            
          }
          
          </button>
         
          <IoMdAddCircleOutline className="text-2xl text-yellow-50 cursor-pointer font-semibold" />
         
          </div>
          {
            editSection && <p className=" text-sm underline text-richblack-200 cursor-pointer " onClick= {cancelEdit}
            >Cancel Edit</p>
          }
          </div>
        </form>

        { course.courseContent.length > 0 && (<NestedView handleChangeEditSectionName =  {handleChangeEditSectionName}></NestedView>)}

        <div className="flex justify-end gap-4">
          <button className="font-semibold py-2 px-4 bg-richblack-600 rounded-md" onClick={goBack}>Back</button>
          <button className="font-semibold  py-2 px-4 bg-yellow-50 rounded-md text-richblack-900 flex gap-1 items-center" onClick={goNext}>
          Next
          <MdNavigateNext />
          </button>
        </div>
      </div>
    </div>
  );
}
