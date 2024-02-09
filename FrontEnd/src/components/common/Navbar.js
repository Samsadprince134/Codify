import React, { useState } from 'react'
import { Link, matchPath } from 'react-router-dom'
import {NavbarLinks} from "../../data/navbar-links"
import { FaCartPlus } from "react-icons/fa";
import { AiOutlineMenu} from "react-icons/ai"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react';
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { categories } from '../services/apis';
import { IoIosArrowDown } from "react-icons/io";
import { apiConnector } from '../services/apiconnector';
import CLogo from '../../assets/Logo/CLogo.png'
import NavBarModal from "../core/NavBarModal"
export default function Navbar() {
  const {token} = useSelector((state) => state.auth)
  const {user} = useSelector((state) => state.profile);
  const {totalItems} = useSelector((state) => state.cart)
  const [navBarModel , setNavBarModel] = useState(false)
  const location = useLocation()
    function matchRoute (route){
        return matchPath({path:route}, location.pathname)

    }
    async function fetchLink(){
        try{
            const  result = await apiConnector("GET" , categories.CATEGORIES_API)
           
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
    <div className='flex h-14 items-center  border-b border-richblack-700'>
        <div className='w-11/12  max-w-maxContent  mx-auto flex justify-between mt-2 items-center  '>
            <Link to={"/"}>

              {/* <img src={logo} width = {160} height = {42} loading='lazy' alt='pic' ></img> */}
              <div className = "flex items-center ">
              <img src={CLogo} className='h-[50px]'></img>
              <p className='text-richblack-50 text-3xl font-bold'>odify</p>
              </div>
             

            </Link>
{/* navlinks */}
            <nav className="hidden md:block">
                <ul className='flex gap-x-6 text-richblack-25'>
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
                                                     className= 'text-richblack-800 font-semibold hover:bg-richblack-300 p-2 px-3 rounded-md transition-all duration-200'>{value.name}</Link>

                                                
                                                    

                                            ))
                                            }
                                            </div>

                                            
                                            
                                           
                                        }
                                        

                                       

                                        </div>

                                    </div>
                                    ) : 
                                (
                                    <Link to = {link?.path}>
                                        <p className= {matchRoute(link?.path) ? " text-yellow-25 " : " text-richblack-25  "}>{link.title}</p>
                                    </Link>

                                )
                            }
                        </li>

                    ))
                }
                    


                </ul>
            </nav>



{/* login/signup/dashboard */}
            <div className='lg:flex gap-x-4 items-center hidden md:block'>
            {
                user && user?.accountType !== "Instructor"  && (
                    <Link to="/dashboard/cart" className='relative'>
                    <FaCartPlus className=' text-white text-2xl mr-3 ' /> 
                    {
                        totalItems > 0 && (<span className='text-white absolute bottom-3 bg-caribbeangreen-200 rounded-full px-2 left-4 icn '>{totalItems}</span>) 
                    }

                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/login">
                        <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md '>Log in</button>
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/signup">
                        <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md '>Sign Up</button>
                    </Link>
                )
            }
            {
                token !== null && <ProfileDropDown></ProfileDropDown>
            }
        
            </div>
            <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" onClick={() => setNavBarModel(true)} />
        </button>

        {navBarModel && <NavBarModal setNavBarModel = {setNavBarModel}></NavBarModal>}

        </div>
    </div>
  )
}
