import { useState } from "react";
import styles from "./AddStudentExcel.module.css";
import * as XLSX from "xlsx";
import axios from "./../axios";
import ReportSubmitAction from "./ReportStudentAction";

export default function AddStudentExcel({ course, onSubmit }) {
  const [students, setStudents] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [messages, setMessages] = useState([]);

  function handleUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const customHeaders = ["student_id", "firstname", "lastname"];
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "base64" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, {
        header: customHeaders,
        range: 1,
        defval: "",
      });
      setStudents(data);
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleSubmit() {
    const payload = { course, students };
    try {
      const result = await axios.post("/api/student-course", payload, {
        params: {
          course_id: course.course,
          section_id: course.section,
        },
      });
      setStudents([]);
      setMessages(result.data.message);
      setShowReport(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className={styles.btn_container}>
        <button
          className={styles.btn}
          onClick={() => document.getElementById("excel-upload").click()}>
          Excel Student Import
        </button>
        <input
          type="file"
          style={{ display: "none" }}
          id="excel-upload"
          onChange={handleUpload}
        />
        <button
          onClick={handleSubmit}
          className={`${students.length === 0 && styles.disabled} ${styles.btn}`}>
          Submit
        </button>
      </div>
      <div className={styles.scroll_box}>
        <table className={styles.table_container}>
          <thead>
            <tr>
              <th className={styles.row}>Student ID</th>
              <th className={styles.row}>First name</th>
              <th className={styles.row}>Last name</th>
            </tr>
          </thead>
          <tbody>
            {students &&
              students.map((student, index) => (
                <tr key={index}>
                  <td className={styles.row}>{student.student_id}</td>
                  <td className={styles.row}>{student.firstname}</td>
                  <td className={styles.row}>{student.lastname}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showReport && (
        <ReportSubmitAction
          onClose={() => {
            setShowReport(false);
            onSubmit();
          }}
          messages={messages}
        />
      )}
    </div>
  );
}
