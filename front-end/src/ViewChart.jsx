import React, { useState, useEffect } from "react";
import axios from "./axios";
import { transformAssessmentData } from "./utils/transformAssessmentData";
import StudentSelector from "./Component/dashboard/StudentSelector";
import DashboardContent from "./Component/dashboard/DashboardContent";
import LoadingSpinner from "./Component/dashboard/LoadingSpinner";
import ErrorAlert from "./Component/dashboard/ErrorAlert";

function ViewChart() {
  // State สำหรับข้อมูลหลัก
  const [courseData, setCourseData] = useState({});
  const [studentPLOData, setStudentPLOData] = useState({});
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State สำหรับนักเรียน
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentCourses, setStudentCourses] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentCourses();
      fetchDashboard();
    }
  }, [selectedStudent]);

  // ฟังก์ชันดึงรายชื่อนักเรียนทั้งหมด
  async function fetchStudents() {
    setLoadingStudents(true);
    try {
      const result = await axios.get("/api/students/program?program_id=1");
      const students = result.data;
      setStudentList(students);

      if (students.length > 0) {
        setSelectedStudent(students[0].student_id);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("ไม่สามารถดึงรายชื่อนักเรียนได้");
    } finally {
      setLoadingStudents(false);
    }
  }

  // ฟังก์ชันดึงรายวิชาที่นักเรียนลงทะเบียน
  async function fetchStudentCourses() {
    if (!selectedStudent) return;

    try {
      const result = await axios.get(
        `/api/student-course/course/${selectedStudent}`
      );
      setStudentCourses(result.data);
    } catch (error) {
      console.error("Error fetching student courses:", error);
      setStudentCourses([]);
    }
  }

  // ฟังก์ชันดึงข้อมูล dashboard
  async function fetchDashboard() {
    if (!selectedStudent) return;

    setLoading(true);
    setError(null);
    try {
      const result = await axios.get(
        `/api/dashboard/${selectedStudent}/clo-report`
      );
      const raw_report = result.data;
      const { courses, courseCLOData, ploData, coursePLOMatrix } =
        transformAssessmentData(raw_report);

      setCourseList(courses);
      setCourseData(courseCLOData);
      setStudentPLOData({ ploList: ploData, coursePLOMatrix: coursePLOMatrix });

      if (courses.length > 0) {
        setSelectedCourse(courses[0].id);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  const handleRetry = () => {
    if (selectedStudent) {
      fetchDashboard();
    } else {
      fetchStudents();
    }
  };

  // แสดงผลการโหลด
  if (loadingStudents) {
    return <LoadingSpinner message="กำลังโหลดรายชื่อนักเรียน..." />;
  }

  // แสดงผล error
  if (error) {
    return <ErrorAlert error={error} onRetry={handleRetry} />;
  }

  // แสดงผลเมื่อไม่มีนักเรียน
  if (studentList.length === 0) {
    return (
      <div className="container py-4">
        <div className="alert alert-info text-center" role="alert">
          <h4 className="alert-heading">ไม่มีข้อมูล</h4>
          <p>ไม่พบรายชื่อนักเรียนในระบบ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">ระบบติดตามความก้าวหน้า PLO/CLO</h1>

      <StudentSelector
        studentList={studentList}
        selectedStudent={selectedStudent}
        onStudentChange={setSelectedStudent}
        studentCourses={studentCourses}
      />

      <DashboardContent
        selectedStudent={selectedStudent}
        loading={loading}
        courseList={courseList}
        courseData={courseData}
        studentPLOData={studentPLOData}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
      />
    </div>
  );
}

export default ViewChart;
