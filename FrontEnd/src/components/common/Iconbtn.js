import React from 'react'
import { RiEditBoxLine } from "react-icons/ri"
export default function Iconbtn({ text, children,
    onclick,
    disabled,
    outline = false,
    customClasses,
    type}) {
   
  return (
    <button disabled = {disabled} onClick={onclick} type={type}   className={`flex items-center ${
      outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
    } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}  `}>
           {children ? (
          <>
            <span className={`${outline && "text-yellow-50"}`}>{text}</span>
            {children}
          </>
        ) : (
          text
        )}
        {
            text === "Edit" && <RiEditBoxLine />
        }
          
    </button>
  )
}
