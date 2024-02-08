import React, { useState } from "react";
import { setLoading } from "../components/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import {getPasswordResetToken} from "../components/services/operations/authAPI"
export default function ForgotPassword() {
  const [emailSent, setEmailSent ] = useState(false);
  const [ email, setemail ] = useState("");
  const { loading } = useSelector((state) => state.auth);
  function changehandler(event) {
    setemail(event.target.value);
  }

  const dispatch = useDispatch()
 
  function submitHandler(event){
   
    event.preventDefault()
    console.log("email im submit handler ---->" , email)
    if(!email){
        toast.error("email is undefined")
    }
    dispatch(getPasswordResetToken(email , setEmailSent))


  }
  return (
    <div className="flex flex-col justify-center items-center text-richblack-25 h-[100vh] gap-y-10">
      {loading ? (
        <div></div>
      ) : (
        <div className=" lg:w-[40%] md:w-[40%] sm:w-[40%]    w-[90%] ">
          <h1 className="lg:text-3xl text-2xl font-semibold" >{emailSent ? "Check Your Email" : "Reset Password"}</h1>
          <p className="mt-1">
            {emailSent
              ? `We have Sent the reset Email to ${email}`
              : "have no fear. We'll Mail you the instructions to reset your password. If you dont have access to your email we can try account recovery "}
          </p>

          <form className="flex flex-col items-start w-full  gap-3" onSubmit={submitHandler}>
            {emailSent ? (
              <div></div>
            ) : (
              <label className="w-full flex flex-col gap-y-1 mt-4">
                <p className="text-[11px]">Email Address <sup className="text-pink-200">*</sup></p>
                <input className="w-full rounded-[0.5rem] text-richblack-5  bg-richblack-800 p-3 "
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={changehandler}
                 
                  placeholder="Email Address"
                  
                  style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            border: "none",
            outline : "none",
       
            
          }}
                ></input>
              </label>
            )}
            <button type="submit" className="p-2 w-full bg-yellow-25 rounded-md text-black ">
              {emailSent ? "Resend Email" : "Reset Password"}
            </button>
          </form>

          <div >
            <Link to="/login" className="flex items-center gap-2">
            <FaLongArrowAltLeft />
              <p className="text-[12px] mt-1">Back To Login</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
