import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {resetPassword} from "../components/services/operations/authAPI"
export default function UpdatePassword() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate()
  const [showPassword1, setshowPassword1] = useState(false);
  const [showPassword2, setshowPassword2] = useState(false);
const {loading} = useSelector((state) => state.auth)
  const [formdata, setFormData] = useState({
    newPassword: "",
    confirmnewPassword: "",
  });

  const { newPassword, confirmnewPassword } = formdata;
  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }
  function submitHandler(event) {
    event.preventDefault();
    console.log("form data is -----> ", formdata);
    const token = location.pathname.split('/').at(-1);
    dispatch(resetPassword(newPassword, confirmnewPassword, token, navigate))

  }
  function eyeHandler1() {
    setshowPassword1(!showPassword1);
  }
  function eyeHandler2() {
    setshowPassword2(!showPassword2);
  }

  return (
    <div>
    {
        loading ? (<div></div>)
    

    :

    ( <div className="flex flex-col justify-center items-center text-richblack-25 h-[100vh] gap-y-10">
      <div className=" lg:w-[40%] md:w-[40%] sm:w-[40%]    w-[90%] ">
        <h1 className="lg:text-3xl text-2xl font-semibold">
          Choose New Password
        </h1>
        <p className="mt-1">
          Almost done, Enter your new Password and you are all set
        </p>

        <form
          className="flex flex-col items-start w-full  gap-3"
          onSubmit={submitHandler}
        >
          <label className="w-full flex flex-col gap-y-1 mt-4 relative">
            <p className="text-[11px]">
              New Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              className="w-full rounded-[0.5rem] text-richblack-5  bg-richblack-800 p-3 "
              required
              type={showPassword1 ? "text" : "password"}
              name="newPassword"
              value={newPassword}
              onChange={changeHandler}
              placeholder="New Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                border: "none",
                outline: "none",
              }}
            ></input>
            <span
              onClick={eyeHandler1}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword1 ? (
                <AiOutlineEye fontSize={24} fill="#AFB2BF"></AiOutlineEye>
              ) : (
                <AiOutlineEyeInvisible
                  fontSize={24}
                  fill="#AFB2BF"
                ></AiOutlineEyeInvisible>
              )}
            </span>
          </label>

          <label className="w-full flex flex-col gap-y-1 mt-4 relative">
            <p className="text-[11px]">
              Confirm New Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              className="w-full rounded-[0.5rem] text-richblack-5  bg-richblack-800 p-3 "
              required
              type={showPassword2 ? "text" : "password"}
              onChange={changeHandler}
              name="confirmnewPassword"
              value={confirmnewPassword}
              placeholder="Confirm New Password"
              autoComplete="off"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                border: "none",
                outline: "none",
              }}
            ></input>

            <span
              onClick={eyeHandler2}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword2 ? (
                <AiOutlineEye fontSize={24} fill="#AFB2BF"></AiOutlineEye>
              ) : (
                <AiOutlineEyeInvisible
                  fontSize={24}
                  fill="#AFB2BF"
                ></AiOutlineEyeInvisible>
              )}
            </span>
          </label>

          <button
            type="submit"
            className="p-2 w-full bg-yellow-25 rounded-md text-black "
          >
            Reset Password
          </button>
        </form>
        <div>
          <Link to="/login" className="flex items-center gap-2">
            <FaLongArrowAltLeft />
            <p className="text-[12px] mt-1">Back To Login</p>
          </Link>
        </div>
      </div>
    </div>)
    }
    </div>
  );
}
