import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ConfirmationModel from "../../../common/ConfirmationModel";
import { deleteSection, deleteSubSection } from "../../../services/operations/courseDetailsAPI";
import { IoMdArrowDropdown } from "react-icons/io";
import { setCourse } from "../../../slices/courseSlice";
import SubSectionModal from "./ViewModals/SubSectionModal";
export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [confirmationmodal, setconfirmationModal] = useState(null);

  async function handleDeletSection(id) {
    try {
      let response = await deleteSection(
        { sectionId: id, courseId: course._id },
        token
      );
      console.log("response -->", response);
      if (response) {
        dispatch(setCourse(response));
      }
      setconfirmationModal(null);
    } catch (error) {
      console.log("Error in deleteing section ", error.message);
    }
  }
  async function handleSubDeletSection(subsectionid , sectionid){
    try{
        let response = await deleteSubSection({subSectionID : subsectionid, sectionID : sectionid, courseId : course._id }, token)
        if (response) {
          dispatch(setCourse(response));
        }
       
          setconfirmationModal(null);
    }
    catch(error){
        console.log("Error in deleteing sub section ", error.message);
    }

  }
  return (
    <div>
      <div className=" rounded-xl bg-richblack-700 p-6 px-8 ">
        {course?.courseContent?.map((section) => (
          <details key={section._id} open>
            <summary className=" flex items-center justify-between gap-x-3 border-b-2">
              <div className="flex gap-2 items-center">
                <RxDropdownMenu />
                <p>{section?.sectionName}</p>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section?.sectionName
                    )
                  }
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() =>
                    setconfirmationModal({
                      text1: "Delete this section",
                      text2: "All the lecture in this section will be deleted",
                      btn1text: "Delete",
                      btn2text: "cancel",
                      btn1Handler: () => {
                        handleDeletSection(section._id);
                      },
                      btn2Handler: () => {
                        setconfirmationModal(null);
                      },
                    })
                  }
                >
                  {" "}
                  <RiDeleteBin5Fill />
                </button>
                <span>|</span>
                <IoMdArrowDropdown />
              </div>
            </summary>

            <div className="ml-5 mt-2">
              {section?.subSection?.map((data) => (
                <div
                  key={data?._id}
                  className="flex items-center justify-between gap-3 border-b-2"
                 
                >
                  <div className="flex gap-2 cursor-pointer items-center w-max"  onClick={() => setViewSubSection(data)}>
                    <RxDropdownMenu />
                    <p>{data?.title}</p>
                  </div>

                  <div className="flex gap-2 items-center">
                    <button onClick={() => setEditSubSection({...data , sectionId : section._id})}> <MdEdit /></button>
                    <button
                  onClick={() =>
                    setconfirmationModal({
                      text1: "Delete this sub section",
                      text2: "Selected lecture will be deleted",
                      btn1text: "Delete",
                      btn2text: "cancel",
                      btn1Handler: () => {
                        handleSubDeletSection(data._id , section._id);
                      },
                      btn2Handler: () => {
                        setconfirmationModal(null);
                      },
                    })
                  }
                >
                  {" "}
                  <RiDeleteBin5Fill />
                </button>

                  </div>
                </div>
            
              ))}
              <button className="mt-1 flex items-center text-yellow-50 font-semibold gap-1 " onClick={()=> setAddSubSection(section._id)}><span  className="text-2xl font-extrabold ">+</span> Add Lecture</button>
            </div>
          </details>
        ))}
        {confirmationmodal && (
          <ConfirmationModel
            confirmationmodal={confirmationmodal}
          ></ConfirmationModel>
        )}
      </div>


      {
        addSubSection && <SubSectionModal modalData = {addSubSection} setModalData = {setAddSubSection} add = {true}></SubSectionModal>
      }
      {
        viewSubSection && <SubSectionModal modalData = {viewSubSection} setModalData = {setViewSubSection} view = {true}></SubSectionModal>
      }
      {
        editSubSection && <SubSectionModal modalData = {editSubSection} setModalData = {setEditSubSection} edit = {true}></SubSectionModal>
      }
      
    </div>
  );
}
