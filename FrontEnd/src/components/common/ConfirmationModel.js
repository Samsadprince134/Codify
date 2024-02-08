import React from 'react'
import Iconbtn from './Iconbtn'

export default function ConfirmationModel({ confirmationmodal }) {
    console.log("modal data-->" , confirmationmodal)
  
  return (
    <div className="fixed inset-0  z-[1000]  flex justify-center items-center bg-richblack-100 bg-opacity-10 backdrop-blur-sm  ">
              <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6 "  >
              <p className="text-2xl font-semibold text-richblack-5">{confirmationmodal?.text1}</p>
              <p className="mt-3 mb-5 leading-6 text-richblack-200">{confirmationmodal?.text2}</p>
              <div className='flex items-center gap-x-4'>
                  <Iconbtn onclick={confirmationmodal?.btn1Handler} text = {confirmationmodal?.btn1text}></Iconbtn>
                  <button onClick={confirmationmodal?.btn2Handler}   className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900">{confirmationmodal?.btn2text}</button>
              </div>

              </div>
    </div>
  )
}
