import React, { useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function RequirementField({
  name,
  label,
  register,
  error,
  setValue,
  getValues,
}) {
 
  
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);
  const {course , editCourse} = useSelector((state) => state.course)
  useEffect(() => {
if(editCourse){
  setRequirementList(course?.instructions)
}
    
    
    register(name , {required : true})
    
  }, [])

  useEffect(() => {
    
   setValue(name , requirementList)
    
  }, [requirementList])
  function handleAddRequirement(event) {
    event.preventDefault()
    if (requirement) {
      setRequirementList([...requirementList, requirement]);
      setRequirement("");
    }
  }
  function handleRemoveRequirement(e, index) {
    const updatedRequirementList = [...requirementList];
    updatedRequirementList.splice(index, 1);
    setRequirementList(updatedRequirementList);
  }
  return (
    <div>
      <div className="relative">
        <label
          htmlFor={name}
          className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"
        >
          {label} <sup className="text-pink-200">**</sup>
        </label>
        <input
          type="text"
          id={name}
          value={requirement}
          placeholder="Add  Instructions"
          onChange={(e) => setRequirement(e.target.value)}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="  w-full rounded-[0.5rem] bg-richblack-700 p-[12px] px-[25px] text-richblack-5"
        ></input>
        {error.message && (
          <span className="text-xs text-pink-200">
            Instructions is Required
          </span>
        )}

        <button
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-5 mt-2"
        >
          <IoAddCircle className="text-3xl absolute right-2 bottom-2 " />
        </button>
        {error[name] && <span className="text-xs text-pink-200">{label} is Required</span>}
      </div>

      <div className="mt-2">
        {requirementList.map((list, index) => (
          <div key={index} className="flex gap-4 items-center   ">
            {list}
            <button
              onClick={() => handleRemoveRequirement(index)}
              className="text-pink-200"
            >
              Clear
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
