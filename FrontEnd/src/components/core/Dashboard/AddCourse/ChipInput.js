import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { useSelector } from "react-redux";
export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  error,
  setValue,
  getValues,
}) {
  const [tag, setTag] = useState("");
  const [tagList, setTagList] = useState([]);
  const {course , editCourse} = useSelector((state) => state.course)
  useEffect(() => {
    if (editCourse) {
      // console.log(course)
      setTagList(course?.tag)
    }
    register(name, { required: true });
  }, []);

  useEffect(() => {
   setValue(name , tagList)
  }, [tagList]);
  function handlerFuntion() {
    if (tag) {
      setTagList([...tagList, tag]);
      setTag("");
    }
  }
  function removeHandler(index) {
    const updatedTagList = [...tagList];
    updatedTagList.splice(index, 1);
    setTagList(updatedTagList);
  }
 
  return (
    <div>
     
      <label
        htmlFor={name}
        className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"
      >
        {label} <sup className="text-pink-200">**</sup>
      </label>
      <div className="flex gap-1">
        {tagList.map((list, index) => (
          <div className="flex gap-1 items-center bg-richblack-900 rounded-md px-2 text-xs">
            {list}
            <RxCrossCircled className="text-pink-200 cursor-pointer"  onClick={() => removeHandler(index)}/>
          </div>
        ))}
      </div>

      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") handlerFuntion();
        }}
        type="text"
        id={name}
        value={tag}
        placeholder={placeholder}
        onChange={(event) => setTag(event.target.value)}
       
        style={{
          boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
        }}
        className=" mt-2  w-full rounded-[0.5rem] bg-richblack-700 p-[12px] px-[25px] text-richblack-5"
      ></input>
      {error.message && (
        <span className="text-xs text-pink-200">Tag is Required</span>
      )}
    
    </div>
  );
}
