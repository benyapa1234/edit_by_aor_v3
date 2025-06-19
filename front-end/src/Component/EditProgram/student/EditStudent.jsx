import { useTranslation } from "react-i18next";
import axios from "./../../axios";

export default function EditStudent({
  year,
  onClose,
  onHandleEdit,
  student,
  setStudent,
  fetchStudent,
}) {
  const { t, i18n } = useTranslation();

  function handleChange(field, value) {
    setStudent((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleEdit() {
    try {
      const result = await axios.put(
        `/api/students/program/${student.student_id}`,
        student
      );
      alert("แก้ไขข้อมูลเสร็จสิ้น");
      fetchStudent();
      onClose();
    } catch (error) {
      alert("เกิดข้อผิดพลาดระหว่างแก้ไขข้อมูล กรุณาลองอีกครั้ง", error);
    }
  }

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Student (ปี {year})</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="mb-2">
              <label className="form-label">{t("Student ID")}</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={student.student_id}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">{t("First Name")}</label>
              <input
                type="text"
                className="form-control"
                value={student.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">{t("Last Name")}</label>
              <input
                type="text"
                className="form-control"
                value={student.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleEdit}>
              {t("Save")}
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
