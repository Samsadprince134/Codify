import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {  matchPath, useLocation } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { FaCartPlus } from "react-icons/fa";
import { AiOutlineMenu} from "react-icons/ai"
import { Link } from 'react-router-dom';
import { NavbarLinks } from '../../data/navbar-links';
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { IoIosArrowDown } from "react-icons/io";
import { ImCross } from "react-icons/im";

export default function NavBarModal({setNavBarModel}) {

    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart)
   
    const location = useLocation()
      function matchRoute (route){
          return matchPath({path:route}, location.pathname)
  
      }
      async function fetchLink(){
          try{
              const  result = await apiConnector("GET" , categories.CATEGORIES_API)
             // console.log("location --- >" , location.pathname)
              console.log("printing sublink result --> ", result.data.data)
              setsubLinks(result.data.data)
  
  
          }
          catch(error){
              console.log("Could not fetch catalog list" , error);
  
          }
      }
  
      const [subLinks , setsubLinks] = useState([]);
      useEffect(() => {
       
            fetchLink()
      }, [])

   
  return (
    <div className='flex items-center  border-b border-richblack-700  fixed inset-0  z-[1000]   justify-center  bg-richblack-100 bg-opacity-10 backdrop-blur-sm  '>
    <div className='w-11/12  rounded-lg border border-richblack-400 bg-richblack-800 p-6   mx-auto flex flex-col  mt-2 items-center  max-w-[450px] gap-8  '>
       

<div className='w-full flex justify-end text-pink-200 text-2xl cursor-pointer ' onClick={() => setNavBarModel(false)}>
<ImCross />

</div>


{/* login/signup/dashboard */}
        <div className='flex gap-x-7 items-center '>
        {
            user && user?.accountType !== "Instructor"  && (
                <Link to="/dashboard/cart" className='relative'>
                <FaCartPlus className=' text-white text-3xl  ' onClick={() => setNavBarModel(false)} /> 
                {
                    totalItems > 0 && (<span className='text-white absolute bottom-3 bg-caribbeangreen-200 rounded-full px-2 left-4 icn '>{totalItems}</span>) 
                }

                </Link>
            )
        }
        {
            token === null && (
                <Link to="/login">
                    <button className='border border-richblack-700 bg-yellow-25  font-bold    px-[12px] py-[8px] text-richblack-900 rounded-lg ' onClick={() => setNavBarModel(false)}>Log in</button>
                </Link>
            )
        }
        {
            token === null && (
                <Link to="/signup">
                    <button className='border border-richblack-700 bg-yellow-25  font-bold   px-[12px] py-[8px] text-richblack-900 rounded-lg ' onClick={() => setNavBarModel(false)}>Sign Up</button>
                </Link>
            )
        }
        {
            token !== null && <ProfileDropDown setNavBarModel = {setNavBarModel}></ProfileDropDown>
        }
    
        </div>



        {/* navlinks */}
        <nav className=" md:block">
            <ul className='flex gap-8 flex-col items-center justify-center text-richblack-25'>
            {
                NavbarLinks.map((link , index) => 
                (
                    
                    <li key = {index}>
                        {
                            link.title === "Catalog" ? (
                                <div className=' relative  flex items-center gap-1 cursor-pointer group'>
                                    <p>{link.title}</p>
                                    <IoIosArrowDown className=' rotate-0 transform   group-hover:rotate-180   ' />
                                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                    
                                   

                                    <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5">

                                    </div>

                                    {
                                        <div className='flex flex-col gap-3 '>
                                        {
                                        
                                        subLinks.map((value , index) => (

                                           
                                                 <Link key={index} to = {`/catalog/${value.name}`}
                                                 className= 'text-richblack-800 font-semibold hover:bg-richblack-300 p-2 px-3 rounded-md transition-all duration-200' onClick={() => setNavBarModel(false)}>{value.name}</Link>

                                            
                                                

                                        ))
                                        }
                                        </div>

                                        
                                        
                                       
                                    }
                                    

                                   

                                    </div>

                                </div>
                                ) : 
                            (
                                <Link to = {link?.path}>
                                    <p className= {matchRoute(link?.path) ? " text-yellow-25 " : " text-richblack-25  "} onClick={() => setNavBarModel(false)}>{link.title}</p>
                                </Link>

                            )
                        }
                    </li>

                ))
            }
                


            </ul>
        </nav>
       

    

    </div>
</div>
  )
}
