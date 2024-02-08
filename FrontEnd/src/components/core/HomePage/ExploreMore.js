import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import { MdPeople } from "react-icons/md";
import HighlightText from "./HighlightText";
export default function ExploreMore() {
  const tabnames = [
    "Free",
    "New to Coding",
    "Most Popular",
    "Skill Paths",
    "Career Paths",
  ];

  const [currentTab, setcurrentTab] = useState(tabnames[0]);
  const [course, setCourse] = useState(HomePageExplore[0]);
  const [isBlue, setisBlue] = useState(true);
  //console.log(course.courses);
  function clrHandler(){
   // setisBlue(!isBlue)
  }
 
 console.log(currentTab)

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-4 gap-3 ">
            <h2 className="text-4xl font-bold">Unlock the <HighlightText text = {"Power of Code"}></HighlightText> </h2>
            <h4 className="text-1xl text-richblack-300">Learn to Build Anything You Can Imagine</h4>
      </div>
      <div className=" flex justify-center w-[78%] gap-[10%] text-[12px] text-richblack-300 bg-richblack-800 rounded-full p-2 px-4 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] max-sm:hidden
        ">
        {tabnames.map((items, index) => (
            
          <button className= {currentTab === items ?  " bg-richblack-900 p-2 rounded-full px-3 w-[40%] text-white " : " bg-richblack-800 p-2 rounded-full px-3  w-[40%] hover:bg-richblack-900 transition-all duration-200"  }onClick={() => {setCourse(HomePageExplore[index]); setcurrentTab(tabnames[index])}}>{items}</button>
        ))}
      </div>
      <div className="relative  top-[8rem]">
        <div className="flex flex-row cursor-pointer gap-[6%] max-sm:flex-col max-sm:gap-8 max-sm: ml-3 max-sm: mr-3  ">
          {course.courses.map((items, index) => (
            <div className = {isBlue ? "bg-richblack-800 p-6" : "bg-white p-6 shadow"} onClick={clrHandler} >
              <h2 className="font-semibold text-lg">{items.heading}</h2>
              <p className=" text-richblack-300 mt-4 text-[17px] ">{items.description}</p>
              <div className="flex justify-between mt-[90px] border-t-2 border-dashed border-richblack-300 py-4 text-richblack-300 ">
                <div>
                  <div className="flex gap-2 items-center">
                    <MdPeople />
                    <div>{items.level}</div>
                  </div>
                </div>

                <div>
                  <div>
                    <div>{items.lessionNumber} Lession</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
