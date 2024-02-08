import React from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import ReactStars from 'react-stars'
import { createRating } from '../../services/operations/courseDetailsAPI'
import { RxCross2 } from "react-icons/rx"

export default function CourseReviewModal({courseId , setReviewModal}) {
    const {user} = useSelector((state) => state.profile)
    const {token} = useSelector((state) => state.auth)
    
const {register , setValue , getValues , handleSubmit , formState : {errors}} = useForm()

useEffect(() => {
    setValue("courseExperience" , "")
    setValue("courseRating" , 0)

}, [])
function ratingChanged(newRating){
setValue("courseRating" , newRating)


}
   async function onSubmit(data){
    

       await createRating({courseId:courseId, rating: data.courseRating ,review : data.courseExperience}, token)
       setReviewModal(false)

    }
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">

      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
           {/* modal header */}
           <div  className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
            <p  className="text-xl font-semibold text-richblack-5">Add Review</p>
            <button onClick={() => {setReviewModal(null)}}>
            <RxCross2 className="text-2xl text-richblack-5" />
            </button>
           </div>


           {/* modal body */}

           <div className="p-6">
                <div>
                      <img src= {user.image} alt='User'    className="aspect-square w-[50px] rounded-full object-cover"></img>
                      <div>
                        <p className="font-semibold text-richblack-5">{user.FirstName} {user.LastName }</p>
                        <p className="text-sm text-richblack-5">Posting Publicly</p>
                      </div>
                </div>




                <form onSubmit={handleSubmit(onSubmit)}  className="mt-6 flex flex-col items-center">

                <ReactStars count={5} onChange={ratingChanged} size={24} activeColor = "#ffd700" ></ReactStars>


             <div className="flex w-11/12 flex-col space-y-2">
             <label htmlFor='courseExperience'       className="text-sm text-richblack-5">Add Your Experience</label>


                <textarea id='courseExperience' placeholder='Add Your Experience' {...register("courseExperience" , {required : true})}   className="form-style resize-x-none min-h-[130px] w-full">

                </textarea>
                {
                    errors.courseExperience && (<span className="ml-2 text-xs tracking-wide text-pink-200">Please add your experience</span>)
                }
                </div>

                <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                <button onClick={() => setReviewModal(null)}   className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>Cancel</button>
                <button className='text-richblack-900 bg-yellow-50 p-2 px-4 font-semibold rounded-md '>Save</button>
                </div>

                   





                </form>
           </div>
      </div>
             
    </div>
  )
}
