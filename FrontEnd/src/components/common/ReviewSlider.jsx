import React, { useEffect, useState } from 'react'
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper/modules'
import ReactStars from 'react-stars'
import {ratingsEndpoints} from "../services/apis"
import { apiConnector } from "../services/apiconnector";
export default function ReviewSlider() {
const [reviews , setReviews ] = useState([])
const truncateWords = 15
async function fetchData(){
  try{
    const response = await  apiConnector("GET" , ratingsEndpoints.REVIEWS_DETAILS_API)
    console.log("Rating response-->" , response.data.data)
    setReviews(response.data.data)

  }
  catch(error){
    console.log("Rating Error --- >" , error)

  }
  console.log("revirws" , reviews[0].user.image)
}
  useEffect(() => {
   fetchData()
  } , [])
  return (
    <div className='text-white h-[190px] max-w-maxContent'>
      <Swiper autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
          slidesPerView={4}
          spaceBetween={25}
          loop={true}
          freeMode = {true}
          modules={[FreeMode, Pagination , Navigation, Autoplay]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="w-full">

          
            {
              reviews.map((rev , index) => (
                <SwiperSlide key={index} >
                <div className='flex gap-x-4 justify-center items-center '>
                  
              
             
                <img src={rev.user.image} alt='' className='h-16  w-16 object-cover rounded-full'></img>
                <div className='flex flex-col '>

               
                 <p>{rev.course.courseName}</p>
                 <p>{rev.user.FirstName} {rev.user.LastName}</p>
                 </div>
                </div>

                <div className='mt-3 flex flex-col'>
                  <p className='font-bold text-yellow-50'>{rev.review}</p>
                  <div className='flex items-center gap-2'>
                     <p className='font-extrabold text-2xl text-caribbeangreen-50 '>{rev.rating}</p>
                     <ReactStars value={rev.rating} size={24} edit = {false} count={5}></ReactStars>
                  </div>
                </div>
                </SwiperSlide>
              ))
            }
          
        
      </Swiper>
    </div>
  )
}
