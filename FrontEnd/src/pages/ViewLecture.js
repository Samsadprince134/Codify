import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../components/services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../components/slices/viewCourseSlice";
import VideoDetailsSideBar from "../components/core/ViewLecture/VideoDetailsSideBar";
import CourseReviewModal from "../components/core/ViewLecture/CourseReviewModal";
export default function ViewLecture() {
  const [reviewModal, setReviewModal] = useState(null);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  async function fetchCourseData() {
    try {
      setLoading(true);
      const response = await getFullDetailsOfCourse(courseId, token);
      console.log("response----->", response);
      dispatch(setCourseSectionData(response.courseDetails.courseContent));
      dispatch(setEntireCourseData(response.courseDetails));
      dispatch(setCompletedLectures(response.completedVideos));
      let lectures = 0;
      response?.courseDetails?.courseContent?.forEach((sec) => {
        lectures = lectures + sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourseData();
  }, []);
  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSideBar
          loading={loading}
          setReviewModal={setReviewModal}
        ></VideoDetailsSideBar>
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && (
        <CourseReviewModal
          courseId={courseId}
          setReviewModal={setReviewModal}
        ></CourseReviewModal>
      )}
    </>
  );
}
