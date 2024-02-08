import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { markLectureAsComplete } from '../../services/operations/courseDetailsAPI'
import { setCompletedLectures, updateCompletedLectures } from '../../slices/viewCourseSlice'

import { Player } from 'video-react';
import 'video-react/dist/video-react.css'
import { FaRegCirclePlay } from "react-icons/fa6";

export default function VideoDetails() {
    const {courseId , sectionId , subSectionId} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const playerRef = useRef()
    const {token} = useSelector((state) => state.auth)
    const { courseSectionData,
        courseEntireData,
        completedLectures,
        totalNoOfLectures} = useSelector((state) => state.viewCourse)

        const [videoData , setVideoData] = useState([])
        const [videoEnded , setVideoEnded] = useState(false)
        const [loading , setLoading]  = useState(false)


        useEffect(() => {
              const setVideoSpecificDetails = async() => {
                console.log("course==" ,  courseSectionData)
                    if(!courseSectionData.length){
                        return
                    }
                    if(!courseId && !sectionId && !subSectionId){
                        navigate("/dashboard/enrolled-courses")
                    }
                    else{
                        // lets assume all 3 fields are present 
                        const filteredData = courseSectionData.filter((course) => course._id === sectionId)
                       
                        const filteredVideoData = filteredData?.[0].subSection.filter((data) => data._id === subSectionId)
                        console.log("filterVideo" ,  filteredVideoData)
                        console.log("url" , filteredVideoData.videoUrl)
                        setVideoData(filteredVideoData[0])
                        setVideoEnded(false)
                    }
              }
              setVideoSpecificDetails()
        }, [courseSectionData , courseEntireData , location.pathname])
    function isFirstVideo(){
           
        const currentSectionIndex = courseSectionData?.findIndex((data) => data._id === sectionId)
        const currentubectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId)

        if(currentSectionIndex === 0 && currentubectionIndex === 0){
            return true
        }
        return false

    }
    function isLastVideo(){
        

        const currentSectionIndex = courseSectionData?.findIndex((data) => data._id === sectionId)
        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length
        const currentubectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId)

        if(currentSectionIndex === courseSectionData.length - 1 && currentubectionIndex === noOfSubSections -  1){
            return true
        }
        return false

    }

    function goToNextVideo(){
        const currentSectionIndex = courseSectionData?.findIndex((data) => data._id === sectionId)
        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length
        const currentubectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId)

        if(currentubectionIndex !== noOfSubSections - 1){
            const nextSubSectionId =  courseSectionData[currentSectionIndex].subSection[currentubectionIndex + 1]._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        }
        else{
              const nextSectionId = courseSectionData[currentSectionIndex + 1]._id
              const nextSubSectionId =  courseSectionData[currentSectionIndex + 1].subSection[0]._id
              navigate(`/view-course/${courseId}/section/${nextSectionId }/sub-section/${nextSubSectionId}`)
              
        }
        

    }
    function goToPreviousVideo(){

        const currentSectionIndex = courseSectionData?.findIndex((data) => data._id === sectionId)
        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length
        const currentubectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId)

        if(currentubectionIndex !== 0){
            const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentubectionIndex - 1]._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)


        }
        else{
            const prevSectionId  = courseSectionData[currentSectionIndex - 1]._id
            const prebSubSEctionLength = courseSectionData[currentSectionIndex - 1].subSection.length
            const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prebSubSEctionLength - 1]._id
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
        }
        

    }

    async function handleLectureCompletion(){
        setLoading(true)
        try{
            const response = await markLectureAsComplete({courseId , subsectionId : subSectionId} , token)
            console.log("response --- >" , response)
            dispatch(updateCompletedLectures(subSectionId))
        }
        catch(error){
            console.log("error in lecture completion" , error)
           
        }
        setLoading(false)

    }

    
  return (
    <div className="flex flex-col gap-5 text-white">
    {
        !videoData ? (<div>No data Found</div>) : 
        (
            <Player
                 ref = {playerRef}
                  aspectRatio = "16:9"
                  
                 
                  playsInline
                
                  onEnded = {() => setVideoEnded(true)}
                  src={videoData?.videoUrl}
                 
             >
             {/* <FaRegCirclePlay className='text-white text-[5xl ] ' position="center"   /> */}

             {
                videoEnded && (<div style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter">{!completedLectures.includes(subSectionId) && (<button disabled = {loading} onClick={handleLectureCompletion}>{!loading ? "Mark as complete" : "Loading..."} </button>)}
                
                 <button disabled = {loading} onClick={() => {if(playerRef?.current){playerRef?.current?.seek(0); setVideoEnded(false)}}} className= "text-xl max-w-max px-4 mx-auto mt-2">Rewatch</button>

                 <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                    {
                        !isFirstVideo() && (<button disabled = {loading} onClick={goToPreviousVideo} className='blackButton'>Prev</button>)
                    }
                    {
                        !isLastVideo() && (<button disabled = {loading} onClick={goToNextVideo} className='blackButton'>Next</button>)
                    } 
                 </div>
                
                </div>)
             }

             
            </Player>
        )
    }

    <h1 className="mt-4 text-3xl font-semibold">
        {videoData?.title}
       
    </h1>
    <p className="pt-2 pb-6">{videoData?.description}</p>
         
    </div>
  )
}
