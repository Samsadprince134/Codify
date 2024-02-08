import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import CountryCode from "../../data/countrycode.json";
import { apiConnector } from "../services/apiconnector";
import { contactusEndpoint } from "../services/apis";
import toast from "react-hot-toast";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    console.log("Form Data -> ", data);
    const toastId = toast.loading("Loading...")
    try {
     
      setLoading(true);
      const response = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      );
      console.log("Email Response - ", response);
      if(response.data.success){
        toast.success("Email Sent Successfully")
      }
      setLoading(false);
      toast.dismiss(toastId)
      
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
      setLoading(false);
      toast.dismiss(toastId)
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (

    <div className="flex justify-center items-center ">

   
    <form
      className="flex flex-col gap-3 mt-5 "
      onSubmit={handleSubmit(submitContactForm)}
    >


      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex flex-col gap-1 lg:w-[48%]">
          <label htmlFor="firstname" className="lable-style">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            {...register("firstname", { required: true })}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
          {errors.firstname && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your name.
            </span>
          )}
        </div>




        <div className="flex flex-col gap-1 lg:w-[48%]">
          <label htmlFor="lastname" className="lable-style">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter last name"
            {...register("lastname")}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </div>
      </div>




      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="lable-style">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          {...register("email", { required: true })}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Email address.
          </span>
        )}
      </div>







      <div className="flex flex-col gap-1">
        <label htmlFor="phoneNo">Phone No.</label>

        <div className="flex gap-3 ">
          <select 
            style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          
            className="w-[17.5%] rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            {...register}
            name="dropdown"
            id="dropdown"
            {...register("countrycode")}
          >
            {CountryCode.map((item, index) => (
              <option key={index} value={item.code}>
                {item.code} - {item.country}{" "}
              </option>
            ))}
          </select>

          <div >
              <input type="number" name="phoneNo" id="phoneNo" placeholder="12345 67890" {...register("phoneNo" , {required:{value :true, message : "Please Enter Your Phone Number"},
              maxLength : {value : 10, message : "Invalid Phone Number"},
              minLength : {value : 8, message : "Invalid Phone Number"} })}
              style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-[100%] rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"></input>
          </div>



        </div>
      </div>









      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="lable-style">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          {...register("message", { required: true })}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Message.
          </span>
        )}
      </div>

      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Send Message
      </button>
    </form>
    </div>
  );
};

export default ContactUsForm;
