import React, { useEffect } from "react";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import OTPInput from "react-otp-input";
import { useState } from "react";
import { verifyemail, sendOtp } from "../components/services/operations/authAPI";
import { FaClockRotateLeft } from "react-icons/fa6";
export default function VerifyEmail() {
    const [otp, setOtp] = useState('');
    const { loading } = useSelector((state) => state.auth);
    const {signupdata} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    function submitHandler(event){
        event.preventDefault()
        console.log(otp)
        dispatch(verifyemail(signupdata , otp , navigate))
    }

    useEffect( () => {
      if(!signupdata){
        navigate("/signup")
      }
    }, [])

    function resendHandler(event){
      event.preventDefault()

      dispatch(sendOtp(signupdata.email , navigate))

    }

  return (
    <div>
      {loading ? (
        <div></div>
      ) : (
        <div className="flex flex-col justify-center items-center text-richblack-25 h-[100vh] gap-y-10">
          <div className=" lg:w-[40%] md:w-[40%] sm:w-[40%]    w-[90%] ">
            <h1 className="lg:text-3xl text-2xl font-semibold">Verify Email</h1>
            <p className="mt-1">
              A verification code has been sent to you. Enter the code below
            </p>
            <form className="flex flex-col justify-center items-center mt-5" onSubmit={submitHandler}>
           
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            
              <button
                type="submit"
                className="p-2 w-full bg-yellow-25 rounded-md text-black mt-5 "
              >
                Verify Email
              </button>
            </form>
            <div className="flex justify-between">
          <Link to="/login" className="flex items-center gap-2">
            <FaLongArrowAltLeft />
            <p className="text-[12px] mt-1">Back To Login</p>
          </Link>
          <div className="text-[14px] cursor-pointer mt-1 text-blue-100 flex gap-2 items-center " onClick={resendHandler}>
          <FaClockRotateLeft />
            Resend it
          </div>
        </div>
          </div>
        </div>
      )}
    </div>
  );
}
