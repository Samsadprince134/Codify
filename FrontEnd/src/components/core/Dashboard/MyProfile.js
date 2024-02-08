import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Iconbtn from '../../common/Iconbtn'
import { FaRegEdit } from "react-icons/fa";
import { useState } from 'react';
export default function MyProfile() {
   const [viewImage , setviewimage] = useState(false);
    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate()
    function viewHandler(){
      setviewimage(!viewImage);
    }
  return (
    <div className='text-richblack-300'>
           <h1 className="mb-14 text-3xl font-medium text-richblack-5">My Profile</h1>
           <section className="flex sm:flex-col  lg:flex-row items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                    <div className='flex items-center gap-x-3'> 
                        <img src={user?.image} 
                        alt='Myimage'
                        onClick={viewHandler}
                        className=' aspect-square w-[78px] object-cover rounded-full  '></img>
                        <div>
                            <p className='text-2xl font-semibold text-richblack-5'>{user?.FirstName}  {" "} {user?.LastName}</p>
                            <p>{user?.Email}</p>
                        </div>

                    </div>
                    <div >
                        <Iconbtn  text = "Edit" 
                        
                         onclick={() => {navigate("/dashboard/settings")}}  ></Iconbtn>
                        
                
                    </div>
           </section>
           <section className='flex flex-col  p-8 px-12 bg-richblack-800 rounded-md border-[1px] border-richblack-700 mt-10 gap-y-10 '>
                  <div className='flex items-center justify-between'>
                    <p className='text-2xl font-semibold text-richblack-5'>About</p>
                    <div>
                    <Iconbtn text = "Edit"
                         onclick={() => {navigate("/dashboard/settings")}}></Iconbtn>
                       
                    

                    </div>
                    
                  </div>
                  <p>{user?.additionalDetails?.about ?? "Write Something About Yourself"}</p>
           </section>


           <section className='flex flex-col gap-y-10 mt-10  bg-richblack-800 rounded-md p-8 px-12'>
                 <div className='flex items-center justify-between'>
                    <p  className='text-2xl font-semibold text-richblack-5'>Personal Details</p>
                    <div>
                    <Iconbtn text = "Edit"
                         onclick={() => {navigate("/dashboard/settings")}}></Iconbtn>
                       
                   

                    </div>

                 </div>

                 <div className='grid grid-rows-3  grid-cols-2 gap-7'>
                       <div className='flex flex-col '>
                          <p className='text-1xl'>First Name</p>
                          <p className='text-richblack-5 font-semibold'>{user?.FirstName}</p>
                       </div>
                      
                       <div>
                          <p>Last Name</p>
                          <p className='text-richblack-5 font-semibold'>{user?.LastName}</p>
                       </div>
                       <div>
                          <p>Email</p>
                          <p className='text-richblack-5 font-semibold'>{user?.Email}</p>
                       </div>
                       <div>
                          <p>Contact Number</p>
                          <p className='text-richblack-5 font-semibold'>{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
                       </div>
                       <div>
                          <p>Gender</p>
                          <p className='text-richblack-5 font-semibold'>{user?.additionalDetails?.gender ?? "Add Gender"}</p>
                       </div>
                       <div>
                          <p>Date of Birth</p>
                          <p className='text-richblack-5 font-semibold'>{user?.additionalDetails?.dateOfBirth ?? "Add date of Birth"}</p>
                       </div>
                       
                 </div>
           </section>

           {
          viewImage && 
          
             ( <div  className="flex  justify-center items-center fixed  inset-0 bg-richblack-100 bg-opacity-10 backdrop-blur-sm ">
                    <img onClick={viewHandler}
                  src={user?.image}
                  alt={`profile-${user?.firstName}`}
                  className="aspect-square w-[25%] rounded-full object-cover "
                />
                   
              </div>
             )
          
        }
      <div  className='mt-10 h-1'></div>
    </div>
  )
}
