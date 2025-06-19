import { useEffect, useState } from "react";
import AddStudentExcel from "../student/AddStudentExcel";
import styles from "./styles/Student.module.css";
import StudentTable from "../student/StudentTable";
import axios from "./../axios";

export default function StudentControl({ onClose, courseDetail }) {
  const [activeTab, setActiveTab] = useState(0);
  const [students, setStudents] = useState([]);

  async function fetchStudentByCourse() {
    try {
      const response = await axios.get("/api/student-course/student", {
        params: {
          course_id: courseDetail.course,
          section_id: courseDetail.section,
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchStudentByCourse();
  }, [activeTab, courseDetail]);

  return (
    <div className={styles.modal_container}>
      <div className={styles.modal_content}>
        <h1 className={styles.header}>
          Student Management for{" "}
          {`${courseDetail.course} sec ${courseDetail.section}`}
        </h1>
        <div>
          <ul className={styles.tab_selector_container}>
            <li
              className={`${styles.tab_selector} ${activeTab === 0 && styles.active}`}
              onClick={() => setActiveTab(0)}>
              Student Table
            </li>
            <li
              className={`${styles.tab_selector} ${activeTab === 1 && styles.active}`}
              onClick={() => setActiveTab(1)}>
              Import from Excel
            </li>
          </ul>
        </div>

        {activeTab === 0 && (
          <div>
            <StudentTable students={students} />
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <AddStudentExcel
              course={courseDetail}
              onSubmit={() => setActiveTab(0)}
            />
          </div>
        )}

        <div>
          <button onClick={onClose} className={styles.btn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
