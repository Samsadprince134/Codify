import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetCourseState, setStep } from '../../../slices/courseSlice'
import { useForm } from 'react-hook-form'
import { COURSE_STATUS } from '../../../../utils/constants'
import { useNavigate } from 'react-router-dom'
import { editCourseDetails } from '../../../services/operations/courseDetailsAPI'
export default function CoursePublishForm() {

 const {course} = useSelector((state) => state.course)
 const {token} = useSelector((state) => state.auth)
 const [loading , setLoading] = useState(false)
   const {register, handleSubmit , setValue , getValues  , formState : {errors}} = useForm()

   useEffect(() => {
     if(course?.status === COURSE_STATUS.PUBLISHED){
      setValue("public" , true)
     }
   }, [])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  function goBackHandler(){
    dispatch(setStep(2))
  }

function goToCourses(){
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses")
}
  async function handleCoursePublish(){
    if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) || (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false )){
                   goToCourses();
                   return
    }
      

    const formdata = new FormData()
    formdata.append("courseId" , course._id);
    const  courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT 
    formdata.append("status" , courseStatus);
    setLoading(true);
    const  result = await editCourseDetails(formdata , token)
    if(result){
        goToCourses()
    }
  setLoading(false)
        
  }
  function onSubmit(data){

    handleCoursePublish()

  }
  return (
    <div>
        <div className='bg-richblack-800 flex flex-col rounded-lg p-4 px-6'>
            <h1 className='text-3xl font-semibold text-richblack-25'>Publish Settings</h1>

            <form onSubmit={handleSubmit(onSubmit)}  className='  flex flex-col justify-center gap-2 mt-4'>
            <div className='flex gap-2 items-center '>

           
            <input type='checkbox' id='public' {...register("public" , {required : true})} className='rounded-full h-4 w-4 '></input>
            <label htmlFor='public'>Make this course as public</label>
           
            </div>
            <div className='flex justify-end gap-3'>
                <button disabled = {loading} onClick={goBackHandler} className='font-semibold bg-richblack-300 p-2 px-4 rounded-md text-black '>Back</button>
                <button className='font-semibold text-black bg-yellow-50 p-2 px-4 rounded-md '>Save Changes</button>
            </div>

             
            </form>
        </div>

    </div>
  )
}
