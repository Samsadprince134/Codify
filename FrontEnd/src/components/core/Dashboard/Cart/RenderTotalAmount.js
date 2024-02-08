import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Iconbtn from '../../../common/Iconbtn';
import { buyCourse } from '../../../services/operations/studentFeaturesApi';
import { useNavigate } from 'react-router-dom';
export default function RenderTotalAmount() {
  const { cart, total } = useSelector((state) => state.cart);
  const naviagte = useNavigate();
  const dispatch = useDispatch()
  const {token} = useSelector((state) => state.auth)
  const {user} = useSelector((state) => state.profile)
  function handleBuyCourse(){
const courses = cart.map((course) => course._id)
console.log("Bought these courses" , courses)
    
        buyCourse(token , courses , user , naviagte , dispatch )
       

  }
  return (
    <div className='bg-richblack-800 p-3 px-12 rounded-md h-fit '>
      <p>Total :</p>
      <p className='text-2xl text-yellow-50 font-semibold'>&#8377;{total}</p>
      <div className='mt-5 '>

      
      <Iconbtn text="Buy Now" onclick={handleBuyCourse} customClasses={"w-full justify-center"}></Iconbtn>
      </div>
    </div>
  )
}
