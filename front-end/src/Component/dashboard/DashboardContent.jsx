import React from "react";
import ChartSection from "./ChartSection";
import ProgressSection from "./ProgressSection";
import RecommendationSection from "./RecommendationSection";
import LoadingSpinner from "./LoadingSpinner";

function DashboardContent({
  selectedStudent,
  loading,
  courseList,
  courseData,
  studentPLOData,
  selectedCourse,
  onCourseChange,
}) {
  // แสดงสถานะการโหลดข้อมูล dashboard
  if (loading && selectedStudent) {
    return <LoadingSpinner message="กำลังโหลดข้อมูลของนักเรียน..." />;
  }

  // แสดงข้อความเมื่อยังไม่ได้เลือกนักเรียน
  if (!selectedStudent) {
    return (
      <div className="alert alert-info text-center" role="alert">
        <h5 className="alert-heading">กรุณาเลือกนักเรียน</h5>
        <p className="mb-0">
          เลือกนักเรียนจากรายการด้านบนเพื่อดูข้อมูล PLO/CLO
        </p>
      </div>
    );
  }

  // แสดงข้อมูลเมื่อไม่มีรายวิชา
  if (selectedStudent && !loading && courseList.length === 0) {
    return (
      <div className="alert alert-warning text-center" role="alert">
        <h5 className="alert-heading">ไม่มีข้อมูล</h5>
        <p className="mb-0">นักเรียนคนนี้ยังไม่มีข้อมูล PLO/CLO ในระบบ</p>
      </div>
    );
  }

  // แสดงกราฟและข้อมูลเมื่อมีข้อมูล
  if (selectedStudent && !loading && courseList.length > 0) {
    return (
      <>
        <ChartSection
          courseList={courseList}
          courseData={courseData}
          studentPLOData={studentPLOData}
          selectedCourse={selectedCourse}
          onCourseChange={onCourseChange}
        />

        <ProgressSection
          studentPLOData={studentPLOData}
          courseList={courseList}
        />

        <RecommendationSection studentPLOData={studentPLOData} />
      </>
    );
  }

  return null;
}

export default DashboardContent;
