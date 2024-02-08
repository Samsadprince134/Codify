import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import {
  createSubSection,
  updateSubSection,
} from "../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../slices/courseSlice";
import UploadThumbnail from "../UploadThumbnail "
import Iconbtn from "../../../../common/Iconbtn";
export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  edit = false,
  view = false,
})
 {

    let isInputDisabled = false
    if(view){
        isInputDisabled = true
    }
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    
    if (edit || view) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDescription", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);

  function isFormUpdated() {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDescription !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    }
    return false;
  }

  async function handleEditSubSection() {
    const currentValues = getValues();
    console.log("Current Values  ---- >" , currentValues)
    const formdata = new FormData();
    formdata.append("CoursId" , course._id)
    formdata.append("sectionID", modalData.sectionId);
    formdata.append("subSectionID", modalData._id);

    if (currentValues.lectureTitle !== modalData.title) {
      formdata.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDescription !== modalData.description) {
      formdata.append("description", currentValues.lectureDescription);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formdata.append("video", currentValues.lectureVideo);
    }

    setLoading(true);
    const response = await updateSubSection(formdata, token);
    if (response) {
        dispatch(setCourse(response))
    }
    setModalData(null)
    setLoading(false);
  }
  async function onSubmit(data) {
    console.log("helo")
    if (view) {
      return;
    }
    if (edit) {
      if (!isFormUpdated) {
        toast.error("No changes made to the fields");
      } else {
        handleEditSubSection();
      }
      return;
    }

    const formdata = new FormData();
    formdata.append("CoursId" , course._id)
    formdata.append("sectionID", modalData);
    formdata.append("title", data.lectureTitle);
    formdata.append("description", data.lectureDescription);
    formdata.append("video", data.lectureVideo);

    setLoading(true);
    const response = await createSubSection(formdata, token);
    if (response) {
        console.log("response -->" , response)
      dispatch(setCourse(response))
    }
    setModalData(null);
    setLoading(false);
  }
  
function clickHandler(){
   setModalData(null)
}
  return( 
  <div  className="fixed inset-0 flex items-center justify-center bg-richblack-100 bg-opacity-10 backdrop-blur-md ">
    <div className="flex flex-col gap-1 p-5 mt-5 bg-richblack-900 rounded-2xl ">
        <div className="flex justify-between text-2xl font-semibold">
            {
                edit && <h1>Editing Lecture</h1>
            }
            {
                view && <h1>Viewing Lecture</h1>
            }
            {
                add && <h1>Adding Lecture</h1>
            }
            <button onClick={clickHandler}><RxCross2 /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <UploadThumbnail name = "lectureVideo" label = "Lecture Video"  register = {register}
             setValue={setValue} errors={errors}
       
        video = {true} viewData = {view ? modalData.videoUrl : null} editData = {edit ? modalData.videoUrl : null}  ></UploadThumbnail>

        <div>
        <label htmlFor="lectureTitle">Lecture Title <sup className="text-pink-200">*</sup></label>
        <input id="lectureTitle" placeholder="Lecture Title"   disabled={isInputDisabled}  {...register("lectureTitle" , {required : true})}  style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className=" form-style w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5  " ></input>
          {
            errors.lectureTitle && (<span className="text-xs text-pink-200">Lecture Title is Required</span>)
          }

        </div>


        <div>
        <label htmlFor="lectureDescription">Lecture Description<sup className="text-pink-200">*</sup></label>
        <textarea id="lectureDescription" placeholder="Lecture Description"  disabled={isInputDisabled} {...register("lectureDescription" , {required : true})}  style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className=" form-style w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 min-h-[60px] "></textarea>
          {
            errors.lectureDescription && (<span className="text-xs text-pink-200">Lecture Decsription is Required</span>)
          }

        </div>


        {
            !view && (
            <div className=" flex justify-end ">
            <Iconbtn text = {loading ? "Loading...." : edit ? "Save Changes" : "Save" }></Iconbtn>

            </div>)
        }




          </form>
    </div>
    
  </div>
  );
}
