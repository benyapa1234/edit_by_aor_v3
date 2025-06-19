// //program.controller.js

// async function createFromExcel(req, res) {
//   const rows = req.body;

//   if (!Array.isArray(rows)  rows.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: "Data should be a non-empty array",
//     });
//   }

//   const conn = await pool.getConnection();

//   try {
//     await conn.beginTransaction();

//     for (const row of rows) {
//       const {
//         program_id,
//         program_name,
//         program_name_th,
//         program_shortname_en,
//         program_shortname_th,
//         year,
//       } = row;

//       if (
//         !program_id 
//         !program_name 
//         !program_name_th 
//         !program_shortname_en 
//         !program_shortname_th 
//         !year
//       ) {
//         await conn.rollback();
//         conn.release();
//         return res.status(400).json({
//           success: false,
//           message: Missing required fields in one of the rows: ${JSON.stringify(
//             row
//           )},
//         });
//       }

//       const programQuery = 
//         INSERT INTO program (
//           program_id, program_name, program_name_th, year, program_shortname_en, program_shortname_th
//         ) VALUES (?, ?, ?, ?, ?, ?)
//       ;
//       await conn.query(programQuery, [
//         program_id,
//         program_name,
//         program_name_th,
//         year,
//         program_shortname_en,
//         program_shortname_th,
//       ]);
//     }

//     await conn.commit();
//     conn.release();
//     res.json({ success: true, message: "All rows inserted successfully" });

//   } catch (err) {
//     await conn.rollback();
//     conn.release();
//     console.error("Error processing Excel upload:", err);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// }

// export {
//   createFromExcel,
// };

// //program.route.js

// import {createFromExcel};

// router.post("/excel", createFromExcel);

// export default router;


// //AddProgram.jsx

//   return (
// <div className="button-group ms-auto">
//         <button
//           onClick={() => document.getElementById("uploadProgramFile").click()}
//           className="btn btn-primary"
//           disabled={!selectedFaculty  selectedFaculty === "all"}

//         >
//           Upload Excel (Program)
//         </button>
//         <input
//           type="file"
//           id="uploadProgramFile"
//           style={{ display: "none" }}
//           accept=".xlsx, .xls"
//           onChange={handleProgramExcelUpload}

//         />
//         <button
//           onClick={handleProgramUploadClick}
//           className="btn btn-success"
//           disabled={!excelData  !selectedFaculty || selectedFaculty === "all"}>
//           Submit Excel Data
//         </button>
//       </div>
// ...
// );
// }

// //EditProgram.jsx

// const handleProgramUploadClick = async () => {
//     if (!selectedUniversity  selectedUniversity === "all") {
//       alert("กรุณาเลือกมหาวิทยาลัยก่อนอัปโหลดข้อมูล");
//       return;
//     }

//     if (!selectedFaculty  selectedFaculty === "all") {
//       alert("กรุณาเลือกคณะก่อนอัปโหลดข้อมูล");
//       return;
//     }

//     if (!excelData || excelData.length === 0) {
//       alert("ไม่มีข้อมูลที่จะอัปโหลด กรุณาเลือกไฟล์ Excel");
//       return;
//     }

//     if (!window.confirm(คุณต้องการอัปโหลดข้อมูลโปรแกรมจำนวน ${excelData.length} รายการใช่หรือไม่?)) {
//       return;
//     }

//     try {
//       const dataToUpload = excelData.map(row => ({
//         ...row,
//         university_id: selectedUniversity,
//         faculty_id: selectedFaculty,
//       }));

//       const response = await axios.post("/program/excel", dataToUpload);
//       const data = await response.data;
//       alert("อัปโหลดข้อมูลโปรแกรมสำเร็จ!");
//       setExcelData(null);
//       // อัปเดตข้อมูลเพิ่มเติมได้ตามต้องการ
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("เกิดข้อผิดพลาดในการอัปโหลด: " + error.message);
//     }
//   };

// const handleProgramExcelUpload = async (e) => {
//     const file = e.target.files[0];
//     e.target.value = ""; // reset input เพื่อให้เลือกไฟล์ซ้ำได้

//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       try {
//         const data = event.target.result;
//         const workbook = XLSX.read(data, { type: "binary" });
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];
//         const jsonData = XLSX.utils.sheet_to_json(sheet);

//         if (jsonData.length === 0) {
//           alert("ไม่พบข้อมูลใน Excel");
//           return;
//         }

//         // ✅ ส่งข้อมูลเข้า API เลย (ไม่แนบ university/faculty)
//         const response = await axios.post("/program/excel", jsonData);

//         if (response.data.success) {
//           alert("เพิ่มโปรแกรมเรียบร้อยแล้ว");
//         } else {
//           alert("เกิดข้อผิดพลาด: " + response.data.message);
//         }
//       } catch (err) {
//         console.error("Error reading Excel file:", err);
//         alert("อ่านไฟล์ไม่สำเร็จ");
//       }
//     };

//     reader.readAsBinaryString(file);
//   };