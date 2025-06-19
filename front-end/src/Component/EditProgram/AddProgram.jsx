import { useState } from "react";
import axios from "./../axios";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";


export default function AddProgram({
  setAlert,
  selectedFaculty,
  setFilteredProgram,
  filteredProgram,
  setProgram,
  program,
}) {
  const { t, i18n } = useTranslation();

  const [newProgram, setNewProgram] = useState({
    code: "",
    program_name: "",
    program_name_th: "",
    program_shortname_en: "",
    program_shortname_th: "",
  });

  const [programExcelData, setProgramExcelData] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // asdwad
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
  };

  function handleNewProgramChange(e) {
    const { name, value } = e.target;
    setNewProgram({
      ...newProgram,
      [name]: value,
    });
  }

  const handleAddProgram = async () => {
    if (!newProgram.program_name || newProgram.program_name.trim() === "") {
      showAlert("กรุณากรอกชื่อหลักสูตร", "warning");
      return;
    }

    if (!selectedFaculty || selectedFaculty === "all") {
      showAlert("กรุณาเลือกคณะ", "warning");
      return;
    }

    if (!newProgram.year) {
      showAlert("กรุณากรอกปีของหลักสูตร", "warning");
      return;
    }

    const yearValue = parseInt(newProgram.year, 10);
    if (isNaN(yearValue)) {
      showAlert("ปีของหลักสูตรต้องเป็นตัวเลขที่ถูกต้อง", "warning");
      return;
    }

    const programPayload = {
      code: newProgram.code,
      program_name: newProgram.program_name,
      program_name_th: newProgram.program_name_th || "",
      program_shortname_en: newProgram.program_shortname_en || "",
      program_shortname_th: newProgram.program_shortname_th || "",
      year: yearValue,
    };

    try {
      const response = await axios.post("/api/program", programPayload);
      console.log("✅ Program added successfully!", response.data);

      const newProgramId = response.data.program_id;
      if (!newProgramId) {
        throw new Error("❌ program_id is missing from response");
      }
      console.log("faculty ----> ", selectedFaculty);
      await axios.post("/api/university/program-faculty", {
        program_id: newProgramId,
        faculty_id: selectedFaculty,
      });

      const newProgramItem = {
        program_id: newProgramId,
        code: newProgram.code,
        program_name: newProgram.program_name,
        program_name_th: newProgram.program_name_th || "",
        program_shortname_en: newProgram.program_shortname_en || "",
        program_shortname_th: newProgram.program_shortname_th || "",
        year: yearValue,
      };

      // ✅ อัปเดต state
      setFilteredProgram([...filteredProgram, newProgramItem]);
      setProgram([...program, newProgramItem]);

      setNewProgram({
        code: "",
        program_name: "",
        program_name_th: "",
        program_shortname_en: "",
        program_shortname_th: "",
        year: "",
      });

      showAlert("เพิ่มหลักสูตรเรียบร้อยแล้ว", "success");
    } catch (error) {
      console.error("❌ Error adding program:", error.response?.data || error);

      if (error.response) {
        const errorMessage = error.response.data.errors
          ? error.response.data.errors.join(", ")
          : error.response.data.message || "เกิดข้อผิดพลาดในการเพิ่มหลักสูตร";

        showAlert(errorMessage, "danger");
      } else if (error.request) {
        showAlert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้", "danger");
      } else {
        showAlert("เกิดข้อผิดพลาดในการส่งข้อมูล", "danger");
      }
    }

  };


const handleProgramExcelUpload = async (e) => {
  const file = e.target.files[0];
  e.target.value = ""; 

  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log("Excel JSON Data:", jsonData);

      if (jsonData.length === 0) {
        showAlert("ไม่พบข้อมูลใน Excel", "warning");
        return;
      }

      const dataToUpload = jsonData.map(row => ({
        ...row,
        faculty_id: selectedFaculty,
      }));

      // 👉 เพิ่มตรงนี้ เพื่อ set preview excel
      setProgramExcelData(dataToUpload);
      setShowPreviewModal(true);


      // 👉 ยังไม่ต้อง axios ทันที
    } catch (err) {
      console.error("Error reading Excel file:", err);
      showAlert("อ่านไฟล์ไม่สำเร็จ", "danger");
    }
  };

  reader.readAsArrayBuffer(file);
};

const handleProgramUploadConfirm = async () => {
  try {
    const response = await axios.post("/api/program/excel", programExcelData);

    if (response.data.success) {
      const newPrograms = response.data.programs;
      if (newPrograms && newPrograms.length > 0) {
        setFilteredProgram([...filteredProgram, ...newPrograms]);
        setProgram([...program, ...newPrograms]);
      }
      showAlert(`เพิ่มโปรแกรม ${newPrograms?.length || 0} รายการเรียบร้อยแล้ว`, "success");
       setTimeout(() => {
        setProgramExcelData([]);
        setShowPreviewModal(false);
      }, 1000);

    } else {
      showAlert("เกิดข้อผิดพลาด: " + response.data.message, "danger");
    }
  } catch (err) {
    console.error("Error uploading program excel:", err);
    showAlert("อัปโหลดไฟล์ไม่สำเร็จ", "danger");
  }
};

const handleCloseModal = () => {
  setShowPreviewModal(false);
  setProgramExcelData([]); // เคลียร์ข้อมูล preview ถ้าต้องการ
};

const existingProgramMap = new Set(
  program.map(p => 
    `${p.code?.trim().toLowerCase()}|${p.program_name?.trim().toLowerCase()}|${p.year}`
  )
);




  return (

    <div className="mb-3">

      <h5 className="form-label text-start" style={{ marginBottom: "15px" }}>
        {t('Add Program')}
      </h5>
      <div className="mb-2">
        <input
          type="text"
          className="form-control mb-2"
          placeholder={t('รหัสหลักสูตร')}
          name="code"
          value={newProgram.code}
          onChange={handleNewProgramChange}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder={t("Program Name")}
          name="program_name"
          value={newProgram.program_name}
          onChange={handleNewProgramChange}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder={t("ชื่อหลักสูตร (ไทย)")}
          name="program_name_th"
          value={newProgram.program_name_th}
          onChange={handleNewProgramChange}
        />
        <div className="row mb-2">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder={t("Short Name")}
              name="program_shortname_en"
              value={newProgram.program_shortname_en}
              onChange={handleNewProgramChange}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder={t('ชื่อย่อ (ไทย)')}
              name="program_shortname_th"
              value={newProgram.program_shortname_th}
              onChange={handleNewProgramChange}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder={t('Year')}
              name="year"
              value={newProgram.year}
              onChange={handleNewProgramChange}
            />
          </div>

          <div className="col d-flex justify-content-end" style={{ gap: "15px" }}>
            <button
              className="btn btn-primary"
              onClick={handleAddProgram}
              disabled={newProgram.program_name.trim() === "" || !selectedFaculty || selectedFaculty === "all"}>
              {t('Insert Program')}
            </button>
            <button
              onClick={() => document.getElementById("uploadProgramFile").click()}
              className="btn btn-primary"
              disabled={!selectedFaculty || selectedFaculty === "all"}

            >
              {t('Upload Excel (Program)')}
            </button>
            <input
              type="file"
              id="uploadProgramFile"
              style={{ display: "none" }}
              accept=".xlsx, .xls"
              onChange={handleProgramExcelUpload}

            />
            {showPreviewModal && (
  <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{t("Preview Programs from Excel")}</h5>
          <button type="button" className="btn-close" onClick={handleCloseModal}></button>
        </div>
        <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>{t("Code")}</th>
                <th>{t("Program Name")}</th>
                <th>{t("Program Name (TH)")}</th>
                <th>{t("Short Name")}</th>
                <th>{t("Short Name (TH)")}</th>
                <th>{t("Year")}</th>
              </tr>
            </thead>
            <tbody>
             {programExcelData.map((item, idx) => {
        const key = `${item.code?.trim().toLowerCase()}|${item.program_name?.trim().toLowerCase()}|${item.year}`;
        const isExisting = existingProgramMap.has(key);
        const cellStyle = { color: isExisting ? "black" : "red", backgroundColor: isExisting ? "white" : "#ffe6e6" };

        return (
          <tr key={idx}>
            <td style={cellStyle}>{item.code || "-"}</td>
            <td style={cellStyle}>{item.program_name || "-"}</td>
            <td style={cellStyle}>{item.program_name_th || "-"}</td>
            <td style={cellStyle}>{item.program_shortname_en || "-"}</td>
            <td style={cellStyle}>{item.program_shortname_th || "-"}</td>
            <td style={cellStyle}>{item.year || "-"}</td>
          </tr>
        );
      })}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleCloseModal}>{t("Cancel")}</button>
          <button className="btn btn-success" onClick={handleProgramUploadConfirm}>{t("Upload Programs")}</button>
        </div>
      </div>
    </div>
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
}
