import React from "react";
import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";
import { Link } from "react-router-dom";
export default function Cart() {
  const { totalItems, total } = useSelector((state) => state.cart);
  return (
    <div className="text-white">
      <h1 className="font-semibold text-5xl">Your Cart</h1>
      <p className="mt-10 font-semibold text-richblack-500  border-b-2  border-b-richblack-500 " >{totalItems} Courses in Cart</p>

      {
        total > 0 ? (
        <div className="mt-20 flex justify-between">
               <RenderCartCourses></RenderCartCourses>
               <RenderTotalAmount></RenderTotalAmount>
        </div>) :
         (
          <div className="flex justify-center items-center  h-[60vh]">
          <div className="flex flex-col items-center">

          
          <div className=" text-5xl font-semibold">Your Cart is Empty</div>
          <Link to="/catalog/WebDevelopment" className="flex justify-center mt-4 items-center rounded-lg text-richblack-900  font-semibold bg-yellow-50 py-2 px-8 w-max">
              <button  >Explore Courses</button>
          </Link>
          </div>

          </div>
         )
      }
    </div>
  );
}
