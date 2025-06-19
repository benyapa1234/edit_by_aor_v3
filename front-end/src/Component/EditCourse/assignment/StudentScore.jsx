import { useEffect, useState } from "react";
import styles from "./StudentScore.module.css";
import axios from "./../../axios";

export default function StudentScore({ assignment_id, onClose }) {
  const [studentScores, setStudentScores] = useState([]);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await axios.get(`/api/assignment/score/${assignment_id}`);
        console.log(res.data);
        const data = res.data;
        setStudentScores(data);
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    }
    if (assignment_id) fetchStudents();
  }, []);

  const handleScoreChange = (index, newScore) => {
    const updatedStudents = [...studentScores];
    updatedStudents[index].score = newScore;
    setStudentScores(updatedStudents);
  };

  const handleSave = async () => {
    try {
      await axios.post(`/api/assignment/score`, {
        student_scores: studentScores,
      });
      alert("บันทึกคะแนนเรียบร้อยแล้ว");
    } catch (err) {
      console.error("Error saving scores:", err);
      alert("เกิดข้อผิดพลาดขณะบันทึก");
    }
  };

  return (
    <div className={styles.modal_container}>
      <div className={styles.table_container}>
        <h2 className={styles.header}>คะแนนนักศึกษา</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ชื่อ</th>
              <th>นามสกุล</th>
              <th>คะแนน</th>
            </tr>
          </thead>
          <tbody>
            {studentScores.map((s, idx) => (
              <tr key={s.student_id}>
                <td>{s.id}</td>
                <td>{s.first_name}</td>
                <td>{s.last_name}</td>
                <td>
                  <input
                    type="number"
                    value={s.score ?? 0}
                    min="0"
                    max="100"
                    onChange={(e) =>
                      handleScoreChange(idx, parseInt(e.target.value, 10))
                    }
                    className={styles.score_input}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.button_wrapper}>
          <button
            onClick={() => {
              onClose();
              handleSave();
            }}
            className={styles.save_button}>
            บันทึก
          </button>
          <button onClick={onClose} className={styles.close_button}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
