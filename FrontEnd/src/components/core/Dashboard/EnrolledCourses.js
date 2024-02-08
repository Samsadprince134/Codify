import React, { useState } from 'react'
import { useEffect } from 'react'
import { getUserEnrolledCourses } from '../../services/operations/profileAPI'
import { useSelector } from 'react-redux'
import ProgressBar from '@ramonak/react-progress-bar'
import { useNavigate } from 'react-router-dom'
export default function EnrolledCourses() {

const {token} = useSelector((state) => state.auth);
const [enrolledCourses , setenrolledCourses] = useState(null);
const TRUNCATE_LENGTH = 30
const [loading , setLoading] = useState(false)
const navigate = useNavigate()
    async function fetchdata(){
        try{
          setLoading(true)
            const response = await getUserEnrolledCourses(token);
            console.log("enrollresponse" , response)
          //  console.log("time" , response[6].totalDuration)
           
            setenrolledCourses(response)
           setLoading(false)

        }
        catch(error){
               console.log("Unable to fetch data")
        }
    }

    useEffect(() => {
      fetchdata()
    
      
    }, [])
    
  return (
    <div className='text-white' >

      <div className='text-4xl font-semibold text-richblack-25'>Enrolled Courses</div>

      {
        !enrolledCourses ? (loading && (<div className='flex justify-center items-center w-[80vw] h-[40vh]'><div className='spinner'></div></div>)) : !enrolledCourses.length ? (<div className='flex justify-center items-center w-[80vw] h-[50vh] font-extrabold text-3xl text-pink-100'>You Are Not Enrolled in any Courses</div>) :
         (
             <div className='flex flex-col justify-center items-center mt-10'>
                 <div className=''>
                 <div className='grid grid-cols-3 bg-richblack-500 py-3 px-6 rounded-r-md rounded-l-md   items-center '>

                 
                    <p>Course Name</p>
                    <p className='ml-28  '>Durations</p>
                    <p className='ml-20 '>Progress</p>
                    </div>
                    {
                        enrolledCourses.map((course , index) => (
                                  <div key={index} className=  '   cursor-pointer    grid grid-cols-3 items-center border border-richblack-100 rounded-lg '>
                                       <div className='w-[100%] mx-auto p-2 flex  gap-5   border-r border-richblack-100   ' onClick={() => {navigate(`/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}}>
                                         <img src={course.thumbnail} alt='Course Thumbnail' className='w-[100px] object-cover  rounded-md aspect-square '></img>
                                         <div className='flex flex-col items-center justify-center '>

                                       
                                         <div className='font-semibold'>{course.courseName}</div>
                                         <div className='font-semibold text-richblack-400 text-xs '>{course.description.split(" ").length >
                      TRUNCATE_LENGTH ? course.description.split(" ").slice(0, TRUNCATE_LENGTH).join(" ") + "..." : course.description}</div>
                                         </div>

                                       </div>
                                       <div className=' flex justify-center items-center  border-r-2 border-richblack-100 h-full'>
                                            <div>{course?.totalDuration}  </div>
                                       </div>
                                  <div className='flex gap-2 items-center ml-8'>
                                      <div className='flex items-center'>{course.progressPercentage  || <div>0</div>}%</div>
                                       <ProgressBar completed={course.progressPercentage || 0} height='8px'  width='150px' 
                                       isLabelVisible = {false} ></ProgressBar>
                                  </div>

                                  </div>
                        ))
                    }
                 </div>

             </div>

        )
      }
           
    </div>
  )
}
