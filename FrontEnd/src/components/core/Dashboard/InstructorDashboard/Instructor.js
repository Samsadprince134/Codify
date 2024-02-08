import React, { useEffect, useState } from "react";
import { getInstructorData } from "../../../services/operations/profileAPI";
import { useSelector } from "react-redux";
import InstructorChart from "./InstructorChart";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import { Link } from "react-router-dom";
import { PiHandWavingFill } from "react-icons/pi";
export default function Instructor() {
  const { token } = useSelector((state) => state.auth);
  const [instructorData, setInstructorData] = useState([]);
  const [courses, setCourses] = useState([]);
  const { user } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(false);
  async function fetchData() {
    try {
      setLoading(true);
      const dashboardResponse = await getInstructorData(token);
      console.log("instructor api response -- >", dashboardResponse);
      const instructorCourseResponse = await fetchInstructorCourses(token);
      console.log("instruuctor course response", instructorCourseResponse);

      setInstructorData(dashboardResponse);
      setCourses(instructorCourseResponse);

      console.log("instructor state", instructorData);
      console.log("instructor course state", courses);

      setLoading(false);
    } catch (error) {
      console.log("Instructor dashboard Api error ", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  let totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );
  let totalStudent = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );
  return (
    <div className="text-richblack-5 w-9/12   ">
      <div>
        <h1 className="text-4xl font-extrabold text-richblack-5 "> <div className="flex gap-x-2 items-center">Hi!! {user.FirstName}  <PiHandWavingFill className="text-yellow-5" /> </div></h1>
        <p className="font-semibold text-2xl">Let's start something new</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : courses.length > 0 ? (
        <div className="mt-8">
          <div className="flex gap-x-5 ">
            <div>
              <InstructorChart courses = {instructorData}></InstructorChart>
            </div>
            <div className="bg-richblack-800 min-w-[250px]  p-2 px-6 flex flex-col gap-y-5 rounded-md ">
              <h2 className="text-4xl text-yellow-100 font-bold">Statistics</h2>

              <div>
                <p className="text-richblack-400 font-semibold ">Total Courses</p>
                <p className="text-3xl font-extrabold">{courses.length}</p>
              </div>
              <div>
                <p className="text-richblack-400 font-semibold ">Total Students</p>
                <p  className="text-3xl font-extrabold">{totalStudent}</p>
              </div>
              <div>
                <p className="text-richblack-400 font-semibold ">Total Income</p>
                <p  className="text-3xl font-extrabold">Rs. {totalAmount}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-richblack-800 p-3 px-6 rounded-md ">
            <div className="flex justify-between">
              <h1 className="text-4xl text-yellow-50 font-extrabold">Your Courses</h1>
              <Link to= "/dashboard/my-courses" ><button className="bg-yellow-50 p-2 px-4 text-richblack-900 font-semibold rounded-md ">View all</button></Link>
              
            </div>
            <div className="my-4 flex items-start space-x-6">
              {courses.slice(0,3).map((data, index) => (
                <div key={index} className="w-1/3">
                <div className="flex">
                  <img src={data.thumbnail} alt=""   className="h-[201px] w-full rounded-md object-cover"></img>
                 </div>
                  <div>
                    <p className="text-2xl font-extrabold">{data.courseName}</p>
                  </div>
                  <div className="flex gap-2 text-sm font-semibold items-center ">
                    <p>{data.studentsEnrolled.length} students Enrolled</p>
                    <p>|</p>
                    <p>Rs {data.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
            <p>You have not created any course</p>
            <Link to="/dashboard/add-course">Create a Course</Link>
        </div>
      )}
    </div>
  );
}
