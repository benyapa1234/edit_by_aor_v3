import React, { useEffect, useState } from "react";
import axios from "../axios"; // ให้แน่ใจว่าเส้นทางการนำเข้า axios ถูกต้องตามโครงสร้างโปรเจค
import { useTranslation } from "react-i18next";
import StudentControl from "./StudentControl";

export default function CourseTable({
  course_list,
  deleteCourse,
  onCourseUpdated,
}) {
  const { t, i18n } = useTranslation();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState({
    course_id: "",
    course_name: "",
    course_engname: "",
    section_id: "",
    program_id: "",
    year: "",
    semester_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showStudentModal, setShowStudentModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedSection, setSelectedSection] = useState();
  const [role, setRole] = useState();

  // ฟังก์ชันเปิด Modal และตั้งค่าข้อมูลคอร์สที่จะแก้ไข
  const openEditModal = (course) => {
    setEditingCourse({
      course_id: course.course_id,
      course_name: course.course_name,
      course_engname: course.course_engname,
      section_id: course.section_id || course.section,
      program_id: course.program_id,
      year: course.year,
      semester_id: course.semester_id,
    });
    setErrorMessage(""); // รีเซ็ตข้อความผิดพลาด
    setShowEditModal(true);
  };

  // ฟังก์ชันอัพเดตข้อมูลที่กำลังแก้ไข
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveEdit = async () => {
    const updateData = {
      course_name: editingCourse.course_name,
      course_engname: editingCourse.course_engname,
      program_id: editingCourse.program_id,
      semester_id: editingCourse.semester_id,
    };

    try {
      setIsLoading(true);

      const response = await axios.put(
        `/api/program-course/${editingCourse.course_id}`,
        updateData
      );

      // แจ้งเตือนผู้ใช้
      alert("อัพเดตรายวิชาสำเร็จ");

      // ปิด Modal
      setShowEditModal(false);
      setErrorMessage("");

      // เรียกใช้ callback function ที่ส่งมาจาก parent component
      if (typeof onCourseUpdated === "function") {
        onCourseUpdated(); // เรียกใช้ function ที่ส่งมาจาก parent
      } else {
        console.log("onCourseUpdated callback not available");
      }

    } catch (error) {
      console.error("Error updating course:", error);
      
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message || "เกิดข้อผิดพลาดในการอัพเดตรายวิชา"
        );
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const role_local = localStorage.getItem("user_role");
    setRole(role_local);
  }, []);

  return (
    <div className="mt-4">
      <h4>{t("Course List")}</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>{t("Course ID")}</th>
            <th>{t("Course Name")}</th>
            <th>{t("Course English Name")}</th>
            <th>{t("Section")}</th>
            {role === "Curriculum Admin" && <th>{t("Actions")}</th>}
          </tr>
        </thead>
        <tbody>
          {course_list &&
            course_list.length > 0 &&
            course_list
              .sort((a, b) => a.course_id - b.course_id)
              .map((courseItem) => (
                <tr key={`${courseItem.course_id}_${courseItem.section_id}`}>
                  <td>{courseItem.course_id}</td>
                  <td>{courseItem.course_name}</td>
                  <td>{courseItem.course_engname}</td>
                  <td>{courseItem.section_id}</td>
                  {role === "Curriculum Admin" && (
                    <td>
                      <button
                        onClick={() => {
                          setSelectedCourse(courseItem.course_id);
                          setSelectedSection(courseItem.section_id);
                          setShowStudentModal(true);
                        }}
                        className="btn btn-success btn-sm me-2">
                        Students
                      </button>
                      <button
                        onClick={() => openEditModal(courseItem)}
                        className="btn btn-warning btn-sm me-2">
                        {t("Edit")}
                      </button>
                      <button
                        onClick={() =>
                          deleteCourse(
                            courseItem.course_id,
                            courseItem.section_id
                          )
                        }
                        className="btn btn-danger btn-sm">
                        {t("Delete")}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">แก้ไขรายวิชา</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                <div className="mb-3">
                  <label htmlFor="course_id" className="form-label">
                    รหัสวิชา
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="course_id"
                    name="course_id"
                    value={editingCourse.course_id}
                    onChange={handleInputChange}
                    disabled
                  />
                  <small className="text-muted">
                    รหัสวิชาไม่สามารถแก้ไขได้
                  </small>
                </div>
                <div className="mb-3">
                  <label htmlFor="course_name" className="form-label">
                    ชื่อวิชา (ภาษาไทย)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="course_name"
                    name="course_name"
                    value={editingCourse.course_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="course_engname" className="form-label">
                    ชื่อวิชา (ภาษาอังกฤษ)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="course_engname"
                    name="course_engname"
                    value={editingCourse.course_engname}
                    onChange={handleInputChange}
                  />
                </div>
                {/* อาจมีฟิลด์เพิ่มเติมตามที่ API endpoint รองรับ */}
                <div className="mb-3">
                  <label htmlFor="section_id" className="form-label">
                    เซคชัน
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="section_id"
                    name="section_id"
                    value={editingCourse.section_id}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                  disabled={isLoading}>
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveEdit}
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"></span>
                      กำลังบันทึก...
                    </>
                  ) : (
                    "บันทึกการแก้ไข"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay ทำให้พื้นหลังเป็นสีเข้มเมื่อเปิด Modal */}
      {showEditModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => !isLoading && setShowEditModal(false)}></div>
      )}

      {showStudentModal && (
        <StudentControl
          onClose={() => setShowStudentModal(false)}
          courseDetail={{
            course: selectedCourse,
            section: selectedSection,
          }}
        />
      )}
    </div>
  );
}
