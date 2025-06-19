import { useState, useEffect } from "react";
import styles from "./../styles/Assignment.module.css";
import axios from "../../axios";

export default function EditAssignmentModal({
  assignment,
  clos,
  setModal,
  refresh,
}) {
  const [name, setName] = useState(assignment.assignment_name || "");
  const [description, setDescription] = useState(assignment.description || "");
  const [maxScore, setMaxScore] = useState(assignment.total_score || 0);
  const [dueDate, setDueDate] = useState(assignment.due_date || "");
  const [activeTab, setActiveTab] = useState("assignment");
  const [selectedClos, setSelectedClos] = useState([]);
  const [cloWeights, setCloWeights] = useState({});

  // Fetch CLOs already linked to this assignment
  useEffect(() => {
    async function fetchExistingClos() {
      try {
        const response = await axios.get(
          `/api/assignment/${assignment.assignment_id}/clos`
        );
        const existingClos = response.data || [];

        const selected = existingClos.map((c) => c.clo_id);
        const weights = {};
        existingClos.forEach((c) => {
          weights[c.clo_id] = c.weight;
        });

        setSelectedClos(selected);
        setCloWeights(weights);
      } catch (error) {
        console.error("Error fetching assignment CLOs:", error);
      }
    }

    fetchExistingClos();
  }, [assignment.assignment_id]);

  function toggleClo(id) {
    setSelectedClos((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function onWeightChange(id, value) {
    setCloWeights((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function editAssignment() {
    try {
      const closPayload = selectedClos.map((id) => ({
        id,
        weight: parseFloat(cloWeights[id] || 0),
      }));

      await axios.put(`/api/assignment/${assignment.assignment_id}`, {
        name,
        description,
        max_score: maxScore,
        due_date: dueDate,
        clos: closPayload,
      });

      alert("แก้ไขงานสำเร็จ");
      setModal(false);
      refresh?.();
    } catch (error) {
      console.error("Edit assignment error:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขงาน");
    }
  }

  return (
    <div className={styles.modal_container}>
      <div className={styles.modal}>
        <h2 className={styles.modal_title}>แก้ไขงาน</h2>

        <div className={styles.tab_menu}>
          <button
            className={activeTab === "assignment" ? styles.active_tab : ""}
            onClick={() => setActiveTab("assignment")}>
            รายละเอียดการบ้าน
          </button>
          <button
            className={activeTab === "clo" ? styles.active_tab : ""}
            onClick={() => setActiveTab("clo")}>
            จัดการ CLO
          </button>
        </div>

        {activeTab === "assignment" && (
          <div>
            <div className={styles.input_text_section}>
              <label className={styles.input_label}>ชื่อ</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className={styles.input_field}
              />
            </div>

            <div className={styles.input_text_section}>
              <label className={styles.input_label}>รายละเอียด</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.input_field}
                rows="3"
              />
            </div>

            <div className={styles.input_text_section}>
              <label className={styles.input_label}>คะแนนเต็ม</label>
              <input
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                type="number"
                className={styles.input_field}
              />
            </div>

            <div className={styles.input_text_section}>
              <label className={styles.input_label}>กำหนดส่ง</label>
              <input
                type="date"
                className={styles.input_field}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {activeTab === "clo" && (
          <div>
            {clos.map((clo, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  value={clo.course_clo_id}
                  checked={selectedClos.includes(clo.course_clo_id)}
                  onChange={() => toggleClo(clo.course_clo_id)}
                />
                <label>{`${clo.CLO_code} ${clo.CLO_name}`}</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="น้ำหนัก"
                  value={cloWeights[clo.course_clo_id] || ""}
                  onChange={(e) =>
                    onWeightChange(clo.course_clo_id, e.target.value)
                  }
                  disabled={!selectedClos.includes(clo.course_clo_id)}
                />
              </div>
            ))}
          </div>
        )}

        <div className={styles.button_group}>
          <button className={styles.modal_save_btn} onClick={editAssignment}>
            บันทึกการแก้ไข
          </button>
          <button
            className={styles.modal_close_btn}
            onClick={() => setModal(false)}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
