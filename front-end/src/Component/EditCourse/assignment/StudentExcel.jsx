import { useState } from "react";
import styles from "./StudentExcel.module.css";
import axios from "./../../axios";

export default function StudentExcel({
  students,
  onClose,
  selectedAssignmentStudent,
}) {
  async function handleSubmit() {
    const payload = {
      assignment_id: selectedAssignmentStudent,
      students: students,
    };
    try {
      await axios.post("/api/assignment/assign", payload);
      alert("มอบหมายงายเสร็จสิ้น");
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.header}>รายชื่อนักเรียนจากรายวิชานี้</h2>
        <div className={styles.studentTableWrapper}>
          <table className={styles.studentTable}>
            <thead>
              <tr>
                <th>รหัสนักศึกษา</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr key={index}>
                  <td>{s.student_id}</td>
                  <td>{s.first_name}</td>
                  <td>{s.last_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className={styles.closeButton} onClick={handleSubmit}>
          ตกลง
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          ปิด
        </button>
      </div>
    </div>
  );
}
