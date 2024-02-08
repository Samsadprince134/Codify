import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import {logout} from "../../services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import ConfirmationModel from '../../common/ConfirmationModel'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
export default function Sidebar() {
    const [confirmationmodal , setconfirmationModal] = useState(null);
    console.log("COnfirmation model--->" , confirmationmodal)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {user, loading : profileLoading} = useSelector ((state) => state.profile);
    const { loading: authLoading } = useSelector((state) => state.auth);
    if (profileLoading || authLoading) {
        return <div className="text-white">Spinner loading</div>;
      }
  return (
    <div className='flex  text-richblack-25'>
         <div className='flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10 '>
              <div className='flex flex-col'>
              {
              sidebarLinks.map((link , index) => {
                       if(link.type && user?.accountType !== link.type ) return null;
                       return (
                        <SidebarLink key={link.id } link = {link} iconName = {link.icon}></SidebarLink>
                        
                        
                       )
               } ) 
              }
                    
              </div>

              <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600 '></div>
              <div className='flex flex-col'>
                    <SidebarLink link={{name:"Settings" , path :"/dashboard/settings"}} iconName="VscSettingsGear"></SidebarLink>
           
          
              </div>

              <button onClick={ () => setconfirmationModal({
                  text1 : "Are You Sure ??",
                  text2 : "You Will be logged out of your Account",
                  btn1text : "Logout",
                  btn2text : "cancel",
                  btn1Handler : () => {dispatch(logout(navigate))},
                  btn2Handler : () => {setconfirmationModal(null)},
              })} className="px-8 py-2 text-sm font-medium text-richblack-300">


              <div className='flex items-center gap-x-2 '>
                 <VscSignOut className='text-lg'></VscSignOut>
                <span>Logout</span>
              </div>

              </button>
         </div>
           

{confirmationmodal && <ConfirmationModel confirmationmodal = {confirmationmodal}></ConfirmationModel>}
          
        
    </div>
  )
}
