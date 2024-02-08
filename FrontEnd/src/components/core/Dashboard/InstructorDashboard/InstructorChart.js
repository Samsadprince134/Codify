import React, { useState } from 'react'
import { Chart  } from 'chart.js'
import { registerables } from 'chart.js'
import { Pie } from 'react-chartjs-2'

 Chart.register(...registerables)
export default function InstructorChart({courses}) {
    const [currChart , setCurrChart] = useState("students")

    function getRandomColours(numColors){
        const colours = []
        for(let i = 0; i < numColors;i++){
            const color = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`
            colours.push(color)
        }
        return colours
    }

    // create data for student chart 
    const chartDataForStudents = {
        labels : courses.map((course)=> course.courseName),
        datasets : [
             {
            data : courses.map((course)=> course.totalStudentsEnrolled),
            backgroundColor : getRandomColours(courses.length),
        }
    ]
    }


    // create data for income chart
    const chartDataForIncome = {
        labels : courses.map((course)=> course.courseName),
        datasets : [
             {
            data : courses.map((course)=> course.totalAmountGenerated),
            backgroundColor : getRandomColours(courses.length),
        }
    ]
    }


   // create options

   const options = {
    maintainAspectRatio: false,

   }
  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 min-w-[600px] h-max ">
         <p  className="text-2xl font-extrabold text-caribbeangreen-25  text-richblack-5">Visualize</p>
         <div className="space-x-4 font-semibold">
             <div>
                 <button onClick={() => setCurrChart("students")}  className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}>Student</button>
                 <button onClick={() => setCurrChart("income")}  className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}>Income</button>
             </div>
         </div>
         <div className="relative mx-auto aspect-square h-full w-full">
              <Pie data={currChart === "students" ? chartDataForStudents : chartDataForIncome} options={options}>

              </Pie>
         </div>

    </div>
  )
}
