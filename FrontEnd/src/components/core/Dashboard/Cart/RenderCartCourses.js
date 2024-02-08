import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from 'react-stars'
import { GiNinjaStar } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { removeFromCart } from '../../../slices/cartSlice';
import GetAvgRating from '../../../../utils/avgRating';
export default function RenderCartCourses() {
    const {cart} = useSelector((state) => state.cart)
    const dispatch = useDispatch();

  return (
    <div>
         {
              cart.map((course , index) => (
                <div className='
                flex  gap-28  mb-10 border-b border-b-richblack-600 '>
                     <div className='flex gap-3 mb-5'>
                        <img src={course.thumbnail} alt='Course Thumbnail' className='w-[250px] rounded-md'></img>
                        <div className='flex flex-col gap-3'>
                           <p>{course.courseName}</p>
                           <p className=' text-richblack-400 '>{course.category.name}</p>
                          <div className='flex gap-2 items-center'>
                              <span className='text-yellow-50'> {GetAvgRating(course.ratingAndReviews)} </span>
                              <ReactStars count={5}
                              size={20}
                              edit = {false}
                              activeColor = "#ffd700"
                              emptyIcon = {<GiNinjaStar />}
                              fullIcon = {<GiNinjaStar />}
                              
                              ></ReactStars>
                              <span>{course.ratingAndReviews.length} Ratings</span>
                          </div>
       
                        </div>
                     </div>
                     <div className='flex flex-col gap-3'>
                         <button className=' rounded-sm flex items-center gap-2 bg-richblack-800 p-2 px-4 text-pink-300 ' onClick={() => dispatch(removeFromCart(course._id))}>
                         <MdDelete />
                         <div>Remove</div>
                         </button>
                         <p className='flex justify-end text-2xl text-yellow-50'>&#8377;{course.price}</p>
                     </div>
                </div>

              ))
         }
    </div>
  )
}
