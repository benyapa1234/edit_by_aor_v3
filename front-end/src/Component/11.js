// import React, { useState, useEffect } from 'react';
// import axios from './../axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx';
// import { useLocation } from 'react-router-dom';

// // กำหนด CSS แบบ Inline Style
// const styles = {
//   container: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: '20px',
//   },
//   header: {
//     marginBottom: '20px',
//   },
//   heading: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     marginBottom: '16px',
//   },
//   assignmentInfo: {
//     marginBottom: '16px',
//   },
//   buttonContainer: {
//     display: 'flex',
//     gap: '10px',
//     marginBottom: '20px',
//   },
//   backButton: {
//     padding: '8px 16px',
//     backgroundColor: '#f5f5f5',
//     color: '#333',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     marginBottom: '10px',
//   },
//   primaryButton: {
//     padding: '8px 16px',
//     backgroundColor: '#1976d2',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//   },
//   primaryButtonDisabled: {
//     padding: '8px 16px',
//     backgroundColor: '#78a8d8',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'not-allowed',
//     fontWeight: 'bold',
//   },
//   secondaryButton: {
//     padding: '8px 16px',
//     backgroundColor: '#9c27b0',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//   },
//   editButton: {
//     padding: '8px 16px',
//     backgroundColor: '#ff9800',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//   },
//   outlineButton: {
//     padding: '8px 16px',
//     backgroundColor: 'white',
//     color: '#1976d2',
//     border: '1px solid #1976d2',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//   },
//   dangerButton: {
//     padding: '6px 12px',
//     backgroundColor: '#f44336',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '14px',
//   },
//   hidden: {
//     display: 'none',
//   },
//   tableContainer: {
//     overflowX: 'auto',
//     maxHeight: '600px',
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//   },
//   tableHead: {
//     position: 'sticky',
//     top: 0,
//     backgroundColor: '#f5f5f5',
//   },
//   tableHeaderCell: {
//     padding: '10px',
//     textAlign: 'left',
//     borderBottom: '2px solid #ddd',
//     fontWeight: 'bold',
//   },
//   columnNumber: {
//     width: '50px',
//   },
//   columnStudentId: {
//     width: '120px',
//   },
//   columnName: {
//     width: '200px',
//   },
//   columnScore: {
//     width: '100px',
//     textAlign: 'center',
//   },
//   columnAction: {
//     width: '80px',
//     textAlign: 'center',
//   },
//   tableCell: {
//     padding: '10px',
//     borderBottom: '1px solid #ddd',
//     textAlign: 'left',
//   },
//   scoreCell: {
//     textAlign: 'center',
//     padding: '6px',
//     borderBottom: '1px solid #ddd',
//   },
//   scoreInput: {
//     width: '60px',
//     padding: '6px',
//     textAlign: 'center',
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//   },
//   cloHeader: {
//     position: 'relative',
//     cursor: 'help',
//   },
//   tooltip: {
//     position: 'absolute',
//     visibility: 'hidden',
//     width: '200px',
//     backgroundColor: '#555',
//     color: 'white',
//     textAlign: 'center',
//     padding: '5px',
//     borderRadius: '6px',
//     zIndex: 1,
//     bottom: '125%',
//     left: '50%',
//     marginLeft: '-100px',
//     opacity: 0,
//     transition: 'opacity 0.3s',
//   },
//   tooltipVisible: {
//     visibility: 'visible',
//     opacity: 1,
//   },
//   loadingContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '80vh',
//   },
//   emptyState: {
//     textAlign: 'center',
//     padding: '40px 0',
//   },
//   alert: {
//     position: 'fixed',
//     bottom: '20px',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     padding: '12px 20px',
//     borderRadius: '4px',
//     boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//     zIndex: 1000,
//   },
//   alertSuccess: {
//     backgroundColor: '#4caf50',
//     color: 'white',
//   },
//   alertError: {
//     backgroundColor: '#f44336',
//     color: 'white',
//   },
//   alertInfo: {
//     backgroundColor: '#2196f3',
//     color: 'white',
//   },
//   // เพิ่ม style สำหรับ modal
//   modalBackdrop: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: '20px',
//     borderRadius: '8px',
//     width: '400px',
//     maxWidth: '90%',
//   },
//   modalHeader: {
//     marginBottom: '16px',
//   },
//   modalTitle: {
//     fontSize: '20px',
//     fontWeight: 'bold',
//   },
//   modalBody: {
//     marginBottom: '20px',
//   },
//   modalFooter: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     gap: '10px',
//   },
//   cancelButton: {
//     padding: '8px 16px',
//     backgroundColor: '#f5f5f5',
//     color: '#333',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   confirmButton: {
//     padding: '8px 16px',
//     backgroundColor: '#f44336',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   // สำหรับฟอร์มแก้ไข
//   editForm: {
//     marginBottom: '20px',
//   },
//   formGroup: {
//     marginBottom: '15px',
//   },
//   label: {
//     display: 'block',
//     marginBottom: '5px',
//     fontWeight: 'bold',
//   },
//   input: {
//     width: '100%',
//     padding: '8px',
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//     fontSize: '16px',
//   },
//   select: {
//     width: '100%',
//     padding: '8px',
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//     fontSize: '16px',
//     backgroundColor: 'white',
//   }
// };


// const AssignmentDetail = () => {
//   const { id } = useParams();
//   const assignmentId = id;
//   console.log("ค่า id จาก useParams:", id);
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [assignment, setAssignment] = useState(null);
//   const [clos, setClos] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [scores, setScores] = useState({});
//   const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
//   const [tooltips, setTooltips] = useState({});
  
//   // State สำหรับโหมดการแก้ไข
//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({
//     assignment_name: '',
//     course_name: '',
//     section_id: '',
//     semester_id: '',
//     year: '',
//     program_id: ''
//   });
  
//   // State สำหรับ modal การลบนักเรียน
//   const [confirmModal, setConfirmModal] = useState({
//     show: false,
//     studentId: null,
//     studentName: ''
//   });
//   const [removing, setRemoving] = useState(false);
  
//   // เมื่อคอมโพเนนต์โหลด ตรวจสอบว่ามี assignmentId หรือไม่
//   useEffect(() => {
//     console.log("ค่า assignmentId ที่ได้จาก URL:", assignmentId);
//     if (!assignmentId) {
//       showAlert('ไม่พบรหัส Assignment ในพารามิเตอร์ URL', 'error');
//     }
//   }, []);
  
//   // โหลดข้อมูล Assignment และนักเรียน
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!assignmentId) {
//         showAlert('ไม่พบรหัส Assignment', 'error');
//         setLoading(false);
//         return;
//       }
      
//       try {
//         setLoading(true);
//         console.log("กำลังเรียกข้อมูลด้วย Assignment ID:", assignmentId);
        
//         // เรียก API ด้วย path parameter
//         const response = await axios.get(`/api/assignment/${assignmentId}`);
        
//         console.log("ข้อมูลที่ได้รับจาก API:", response.data);
        
//         if (response.data.success) {
//           // อัพเดท state
//           setAssignment(response.data.assignment);
//           setClos(response.data.clos || []);
          
//           // ตั้งค่าข้อมูลเริ่มต้นสำหรับฟอร์มแก้ไข
//           setEditData({
//             assignment_name: response.data.assignment.assignment_name || '',
//             course_name: response.data.assignment.course_name || '',
//             section_id: response.data.assignment.section_id || '',
//             semester_id: response.data.assignment.semester_id || '',
//             year: response.data.assignment.year || '',
//             program_id: response.data.assignment.program_id || ''
//           });
          
//           // ตรวจสอบข้อมูลนักเรียนก่อนอัพเดท state
//           const receivedStudents = response.data.students || [];
//           console.log("จำนวนนักเรียนที่ได้รับ:", receivedStudents.length);
//           setStudents(receivedStudents);
          
//           // อัพเดทคะแนน (แม้ว่าจะไม่มีคะแนนจริง)
//           setScores(response.data.scores || {});
//         } else {
//           console.error("API ส่งค่า success: false", response.data.message);
//           showAlert(response.data.message || 'ไม่สามารถโหลดข้อมูล Assignment ได้', 'error');
//         }
//       } catch (error) {
//         console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
//         console.error('รายละเอียดข้อผิดพลาด:', error.response ? error.response.data : error.message);
//         showAlert('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + (error.response?.data?.message || error.message), 'error');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     // เรียกฟังก์ชันเฉพาะเมื่อมี assignmentId เท่านั้น
//     if (assignmentId) {
//       fetchData();
//     }
//   }, [assignmentId]);
  
//   // จัดการการเปลี่ยนแปลงค่าในฟอร์มแก้ไข
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
  
//   // บันทึกการแก้ไขข้อมูล Assignment

//   const saveEditAssignment = async () => {
//     try {
//       setSaving(true);
      
//       // ตรวจสอบข้อมูลที่จำเป็น
//       const requiredFields = ['assignment_name', 'course_name', 'section_id', 'semester_id', 'year'];
//       const missingFields = requiredFields.filter(field => !editData[field]);
      
//       if (missingFields.length > 0) {
//         showAlert(`กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.join(', ')}`, 'error');
//         setSaving(false);
//         return;
//       }
      
//       // ใช้ข้อมูลที่มีอยู่แล้วเลย ไม่ต้องดึงใหม่
//       const updateData = {
//         program_id: parseInt(editData.program_id) || assignment.program_id,
//         course_name: editData.course_name,
//         section_id: parseInt(editData.section_id),
//         semester_id: parseInt(editData.semester_id),
//         year: parseInt(editData.year),
//         assignment_name: editData.assignment_name,
//         faculty_id: 1, // กำหนดค่าตายตัว
//         university_id: 1 // กำหนดค่าตายตัว
//       };
      
//       console.log('ข้อมูลที่จะส่งไปอัพเดต:', updateData);
      
//       // เรียกใช้ API สำหรับอัปเดตข้อมูล
//       const response = await axios.put(`api/assignment/${assignmentId}`, updateData);
      
//       console.log('ผลการอัปเดต Assignment:', response.data);
      
//       if (response.data) {
//         // อัปเดตข้อมูลใน state
//         setAssignment(prev => ({
//           ...prev,
//           ...updateData
//         }));
        
//         // ปิดโหมดแก้ไข
//         setIsEditing(false);
//         showAlert('บันทึกการแก้ไขข้อมูล Assignment เรียบร้อยแล้ว', 'success');
//       }
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการบันทึกการแก้ไข:', error);
//       const errorDetail = error.response?.data?.error || error.message;
//       console.error('รายละเอียดข้อผิดพลาด:', errorDetail);
//       showAlert('เกิดข้อผิดพลาดในการบันทึกการแก้ไข: ' + errorDetail, 'error');
//     } finally {
//       setSaving(false);
//     }
//   };
  
//   // ยกเลิกการแก้ไข
//   const cancelEdit = () => {
//     // รีเซ็ตข้อมูลการแก้ไขเป็นค่าเดิม
//     setEditData({
//       assignment_name: assignment.assignment_name || '',
//       course_name: assignment.course_name || '',
//       section_id: assignment.section_id || '',
//       semester_id: assignment.semester_id || '',
//       year: assignment.year || '',
//       program_id: assignment.program_id || ''
//     });
    
//     // ปิดโหมดแก้ไข
//     setIsEditing(false);
//   };
  
//   // จัดการการเปลี่ยนแปลงคะแนน
//   const handleScoreChange = (studentId, cloId, value) => {
//     // ตรวจสอบให้คะแนนเป็นตัวเลขระหว่าง 0-max_score
//     let score = parseFloat(value);
    
//     if (isNaN(score)) {
//       score = 0;
//     } else {
//       // หาคะแนนเต็มของ CLO นี้
//       const maxScore = clos.find(clo => clo.assignment_clo_id === cloId)?.max_score || 100;
//       score = Math.min(Math.max(score, 0), maxScore);
//     }
    
//     // อัพเดทข้อมูลคะแนน
//     setScores(prevScores => {
//       // สร้าง object ใหม่แทนการปรับปรุงอันเดิม เพื่อให้แน่ใจว่า state จะอัพเดท
//       const newScores = { ...prevScores };
      
//       // สร้างหรืออัพเดท object ของนักเรียน
//       if (!newScores[studentId]) {
//         newScores[studentId] = {};
//       }
      
//       // อัพเดทคะแนน
//       newScores[studentId][cloId] = score;
      
//       return newScores;
//     });
//   };
  
//   // บันทึกคะแนนทั้งหมด
//   const saveScores = async () => {
//     if (!assignmentId) {
//       showAlert('ไม่พบรหัส Assignment', 'error');
//       return;
//     }
    
//     try {
//       setSaving(true);
      
//       // สร้างโครงสร้างข้อมูลสำหรับการบันทึก
//       const scoreData = [];
      
//       // แปลงข้อมูลจาก state เป็นรูปแบบที่ API ต้องการ
//       students.forEach(student => {
//         clos.forEach(clo => {
//           scoreData.push({
//             student_id: student.student_id,
//             assignment_id: parseInt(assignmentId),
//             assignment_clo_id: clo.assignment_clo_id,
//             score: scores[student.student_id] && scores[student.student_id][clo.assignment_clo_id] !== undefined 
//               ? scores[student.student_id][clo.assignment_clo_id]
//               : 0
//           });
//         });
//       });
      
//       console.log("ข้อมูลคะแนนที่จะบันทึก:", scoreData);
//       // กำลังแก้
//       const response = await axios.post('/api/students/scores', {
//         assignment_id: parseInt(assignmentId),
//         scores: scoreData
//       });
      
//       if (response.data.success) {
//         showAlert('บันทึกคะแนนเรียบร้อยแล้ว', 'success');
//       } else {
//         showAlert(response.data.message || 'ไม่สามารถบันทึกคะแนนได้', 'error');
//       }
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการบันทึกคะแนน:', error);
//       showAlert('เกิดข้อผิดพลาดในการบันทึกคะแนน: ' + (error.response?.data?.message || error.message), 'error');
//     } finally {
//       setSaving(false);
//     }
//   };
  
//   // แสดง tooltip
//   const showTooltip = (id) => {
//     setTooltips(prev => ({ ...prev, [id]: true }));
//   };
  
//   // ซ่อน tooltip
//   const hideTooltip = (id) => {
//     setTooltips(prev => ({ ...prev, [id]: false }));
//   };
  
//   // จัดการการอัพโหลดไฟล์ Excel
//   const handleFileImport = async (event) => {
//     const file = event.target.files[0];
    
//     if (!file) {
//       return;
//     }
    
//     try {
//       showAlert('กำลังประมวลผลไฟล์ Excel...', 'info');
//       const data = await readExcelFile(file);
      
//       // ประมวลผลข้อมูล Excel
//       if (importExcelData(data)) {
//         showAlert('นำเข้าคะแนนจาก Excel เรียบร้อยแล้ว', 'success');
//       }
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการนำเข้าไฟล์ Excel:', error);
//       showAlert('เกิดข้อผิดพลาดในการนำเข้าไฟล์ Excel: ' + error.message, 'error');
//     }
    
//     // รีเซ็ตค่า input file
//     event.target.value = null;
//   };
  
//   // อ่านไฟล์ Excel และส่งคืนข้อมูล
//   const readExcelFile = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
      
//       reader.onload = (e) => {
//         try {
//           const data = new Uint8Array(e.target.result);
//           const workbook = XLSX.read(data, { type: 'array' });
          
//           // ดึงข้อมูลจาก worksheet แรก
//           const worksheetName = workbook.SheetNames[0];
//           const worksheet = workbook.Sheets[worksheetName];
          
//           // แปลงเป็น JSON
//           const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//           resolve(jsonData);
//         } catch (error) {
//           reject(error);
//         }
//       };
      
//       reader.onerror = (error) => {
//         reject(error);
//       };
      
//       reader.readAsArrayBuffer(file);
//     });
//   };
  
//   // ประมวลผลข้อมูล Excel และอัพเดทคะแนน
//   const importExcelData = (data) => {
//     if (!data || data.length < 2) {
//       showAlert('รูปแบบไฟล์ Excel ไม่ถูกต้อง', 'error');
//       return false;
//     }
    
//     try {
//       // ดึงข้อมูลแถวส่วนหัว (ควรมีรหัส CLO อยู่ในนี้)
//       const headerRow = data[0];
      
//       // หาคอลัมน์ที่เก็บรหัสนักเรียน
//       const studentIdColumnIndex = headerRow.findIndex(
//         cell => cell && cell.toString().toLowerCase().includes('student') && cell.toString().toLowerCase().includes('id')
//       );
      
//       if (studentIdColumnIndex === -1) {
//         showAlert('ไม่พบคอลัมน์รหัสนักเรียนในไฟล์ Excel', 'error');
//         return false;
//       }
      
//       // จับคู่หัวคอลัมน์กับรหัส CLO
//       const cloColumns = {};
      
//       headerRow.forEach((header, index) => {
//         if (index !== studentIdColumnIndex && header) {
//           // หาหัวคอลัมน์ที่ตรงกับรหัส CLO
//           const matchingClo = clos.find(clo => 
//             header.toString().includes(clo.CLO_code)
//           );
          
//           if (matchingClo) {
//             cloColumns[index] = matchingClo.assignment_clo_id;
//           }
//         }
//       });
      
//       if (Object.keys(cloColumns).length === 0) {
//         showAlert('ไม่พบข้อมูล CLO ในไฟล์ Excel ที่ตรงกับ Assignment นี้', 'error');
//         return false;
//       }
      
//       // สร้างออบเจกต์คะแนนใหม่
//       const newScores = { ...scores };
//       let updatedCount = 0;
      
//       // ประมวลผลแต่ละแถว (ข้ามแถวส่วนหัว)
//       for (let i = 1; i < data.length; i++) {
//         const row = data[i];
//         if (!row || !row[studentIdColumnIndex]) continue;
        
//         const studentId = row[studentIdColumnIndex].toString();
//         // ข้ามถ้านักเรียนไม่อยู่ในรายชื่อของเรา
//         const isValidStudent = students.some(s => s.student_id === studentId);
//         if (!isValidStudent) continue;
        
//         // สร้าง object สำหรับนักเรียนถ้ายังไม่มี
//         if (!newScores[studentId]) {
//           newScores[studentId] = {};
//         }
        
//         // ประมวลผลแต่ละคอลัมน์ CLO
//         Object.entries(cloColumns).forEach(([columnIndex, cloId]) => {
//           const rawScore = row[columnIndex];
//           if (rawScore === undefined || rawScore === null) return;
          
//           const score = parseFloat(rawScore);
//           const cloInfo = clos.find(c => c.assignment_clo_id === cloId);
//           const maxScore = cloInfo ? cloInfo.max_score : 100;
          
//           // อัพเดทคะแนนถ้าเป็นตัวเลขที่ถูกต้องระหว่าง 0-maxScore
//           if (!isNaN(score) && score >= 0 && score <= maxScore) {
//             newScores[studentId][cloId] = score;
//             updatedCount++;
//           }
//         });
//       }
      
//       // อัพเดทสถานะคะแนน
//       setScores(newScores);
//       console.log(`อัพเดทคะแนนแล้ว ${updatedCount} รายการ`);
//       return updatedCount > 0;
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการประมวลผลข้อมูล Excel:', error);
//       showAlert('เกิดข้อผิดพลาดในการประมวลผลข้อมูล Excel: ' + error.message, 'error');
//       return false;
//     }
//   };
  
//   // สร้างเทมเพลต Excel
//   const downloadExcelTemplate = () => {
//     if (!clos.length || !students.length) {
//       showAlert('ไม่มีข้อมูล CLO หรือนักเรียนสำหรับสร้างเทมเพลต', 'error');
//       return;
//     }
    
//     try {
//       // สร้าง worksheet
//       const ws = XLSX.utils.aoa_to_sheet([]);
      
//       // เตรียมข้อมูลส่วนหัว
//       const headers = ['Student ID', 'Student Name'];
//       clos.forEach(clo => {
//         headers.push(`${clo.CLO_code} (max: ${clo.max_score})`);
//       });
      
//       // เพิ่มแถวส่วนหัว
//       XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });
      
//       // เพิ่มข้อมูลนักเรียน
//       const data = students.map(student => {
//         const row = [student.student_id, student.name || ''];
        
//         clos.forEach(clo => {
//           const score = (scores[student.student_id] && 
//                        scores[student.student_id][clo.assignment_clo_id] !== undefined) 
//             ? scores[student.student_id][clo.assignment_clo_id] 
//             : 0;
          
//           row.push(score);
//         });
        
//         return row;
//       });
      
//       XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A2' });
      
//       // สร้าง workbook
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Scores');
      
//       // สร้างไฟล์ Excel และดาวน์โหลด
//       XLSX.writeFile(wb, `${assignment?.assignment_name || 'Assignment'}_Scores_Template.xlsx`);
//       showAlert('ดาวน์โหลดเทมเพลต Excel เรียบร้อยแล้ว', 'success');
      
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการสร้างเทมเพลต Excel:', error);
//       showAlert('เกิดข้อผิดพลาดในการสร้างเทมเพลต Excel: ' + error.message, 'error');
//     }
//   };
  
//   // เปิด modal ยืนยันการลบนักเรียน
//   const openConfirmRemoveModal = (studentId, studentName) => {
//     setConfirmModal({
//       show: true,
//       studentId,
//       studentName
//     });
//   };
  
//   // ปิด modal ยืนยันการลบนักเรียน
//   const closeConfirmModal = () => {
//     setConfirmModal({
//       show: false,
//       studentId: null,
//       studentName: ''
//     });
//   };
  
//   // ลบนักเรียนออกจาก Assignment
//   const removeStudentFromAssignment = async () => {
//     const { studentId } = confirmModal;
    
//     if (!studentId || !assignmentId) {
//       closeConfirmModal();
//       return;
//     }
    
//     try {
//       setRemoving(true);
      
//       // เรียก API สำหรับลบนักเรียน
//       const response = await axios.delete('http://localhost:8000/api/remove_student_from_assignment', {
//         data: {
//           assignment_id: parseInt(assignmentId),
//           student_id: studentId
//         }
//       });
      
//       if (response.data.success) {
//         // อัพเดทรายชื่อนักเรียนในหน้าจอ
//         setStudents(prevStudents => prevStudents.filter(student => student.student_id !== studentId));
        
//         // ลบคะแนนของนักเรียนที่ถูกลบออก
//         setScores(prevScores => {
//           const newScores = { ...prevScores };
//           delete newScores[studentId];
//           return newScores;
//         });
        
//         showAlert('ลบนักเรียนออกจาก Assignment เรียบร้อยแล้ว', 'success');
//       } else {
//         showAlert(response.data.message || 'ไม่สามารถลบนักเรียนได้', 'error');
//       }
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการลบนักเรียน:', error);
//       showAlert('เกิดข้อผิดพลาดในการลบนักเรียน: ' + (error.response?.data?.message || error.message), 'error');
//     } finally {
//       setRemoving(false);
//       closeConfirmModal();
//     }
//   };
  
//   // แสดงข้อความแจ้งเตือน
//   const showAlert = (message, type = 'info') => {
//     setAlert({ show: true, message, type });
    
//     // ซ่อนข้อความอัตโนมัติหลังจาก 5 วินาที
//     setTimeout(() => {
//       setAlert({ show: false, message: '', type: 'info' });
//     }, 5000);
//   };
  
//   // ส่วนแสดงผลหน้าเว็บ
//   if (loading) {
//     return (
//       <div style={styles.loadingContainer}>
//         <p>กำลังโหลด...</p>
//       </div>
//     );
//   }
  
//   if (!assignment) {
//     return (
//       <div style={styles.emptyState}>
//         <h2>ไม่พบข้อมูล Assignment (ID: {assignmentId || 'ไม่ระบุ'})</h2>
//         <p>อาจเป็นเพราะ Assignment ID ไม่ถูกต้อง หรือไม่มีข้อมูลในระบบ</p>
//         <button 
//           style={styles.backButton} 
//           onClick={() => navigate('/assignments')}
//         >
//           ← กลับไปหน้า Assignments
//         </button>
//       </div>
//     );
//   }
//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <button 
//           style={styles.backButton} 
//           onClick={() => navigate('/assignments')}
//         >
//           ← กลับไปหน้า Assignments
//         </button>
        
//         {isEditing ? (
//           // แสดงฟอร์มแก้ไขเมื่ออยู่ในโหมดการแก้ไข
//           <div style={styles.editForm}>
//             <h1 style={styles.heading}>แก้ไขข้อมูล Assignment</h1>
            
//             <div style={styles.formGroup}>
//               <label style={styles.label}>ชื่อ Assignment:</label>
//               <input
//                 type="text"
//                 name="assignment_name"
//                 value={editData.assignment_name}
//                 onChange={handleEditChange}
//                 style={styles.input}
//               />
//             </div>
            
//             <div style={styles.formGroup}>
//               <label style={styles.label}>ชื่อวิชา:</label>
//               <input
//                 type="text"
//                 name="course_name"
//                 value={editData.course_name}
//                 onChange={handleEditChange}
//                 style={styles.input}
//               />
//             </div>
            
//             <div style={styles.formGroup}>
//               <label style={styles.label}>เซคชัน:</label>
//               <input
//                 type="text"
//                 name="section_id"
//                 value={editData.section_id}
//                 onChange={handleEditChange}
//                 style={styles.input}
//               />
//             </div>
            
//             <div style={styles.formGroup}>
//               <label style={styles.label}>ภาคการศึกษา:</label>
//               <input
//                 type="text"
//                 name="semester_id"
//                 value={editData.semester_id}
//                 onChange={handleEditChange}
//                 style={styles.input}
//               />
//             </div>
            
//             <div style={styles.formGroup}>
//               <label style={styles.label}>ปีการศึกษา:</label>
//               <input
//                 type="text"
//                 name="year"
//                 value={editData.year}
//                 onChange={handleEditChange}
//                 style={styles.input}
//               />
//             </div>
            
//             <div style={styles.buttonContainer}>
//               <button
//                 style={saving ? styles.primaryButtonDisabled : styles.primaryButton}
//                 onClick={saveEditAssignment}
//                 disabled={saving}
//               >
//                 {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
//               </button>
              
//               <button
//                 style={styles.cancelButton}
//                 onClick={cancelEdit}
//                 disabled={saving}
//               >
//                 ยกเลิก
//               </button>
//             </div>
//           </div>
//         ) : (
//           // แสดงข้อมูล Assignment ปกติ
//           <>
//             <h1 style={styles.heading}>
//               {assignment.assignment_name} - คะแนนนักเรียน
//             </h1>
            
//             <div style={styles.assignmentInfo}>
//               <p>
//                 <strong>วิชา:</strong> {assignment.course_name}
//                 &nbsp;&nbsp;|&nbsp;&nbsp;
//                 <strong>เซคชัน:</strong> {assignment.section_id}
//                 &nbsp;&nbsp;|&nbsp;&nbsp;
//                 <strong>ภาคการศึกษา:</strong> {assignment.semester_id}/{assignment.year}
//               </p>
//             </div>
            
//             <div style={styles.buttonContainer}>
//               {/* เพิ่มปุ่มแก้ไข Assignment */}
//               <button 
//                 style={styles.editButton} 
//                 onClick={() => setIsEditing(true)}
//               >
//                 แก้ไขข้อมูล Assignment
//               </button>
              
//               <button 
//                 style={saving ? styles.primaryButtonDisabled : styles.primaryButton} 
//                 onClick={saveScores}
//                 disabled={saving}
//               >
//                 {saving ? 'กำลังบันทึก...' : 'บันทึกคะแนน'}
//               </button>
              
//               <label htmlFor="excel-file-input">
//                 <button 
//                   style={styles.secondaryButton} 
//                   onClick={() => document.getElementById('excel-file-input').click()}
//                 >
//                   นำเข้าจาก Excel
//                 </button>
//               </label>
//               <input
//                 id="excel-file-input"
//                 type="file"
//                 accept=".xlsx,.xls"
//                 onChange={handleFileImport}
//                 style={styles.hidden}
//               />
              
//               <button 
//                 style={styles.outlineButton} 
//                 onClick={downloadExcelTemplate}
//               >
//                 ดาวน์โหลดเทมเพลต Excel
//               </button>
//             </div>
//           </>
//         )}
//       </div>
      
//       {!isEditing && students && students.length > 0 ? (
//         <div style={styles.tableContainer}>
//           <table style={styles.table}>
//             <thead style={styles.tableHead}>
//               <tr>
//                 <th style={{...styles.tableHeaderCell, ...styles.columnNumber}}>ลำดับ</th>
//                 <th style={{...styles.tableHeaderCell, ...styles.columnStudentId}}>รหัสนักศึกษา</th>
//                 <th style={{...styles.tableHeaderCell, ...styles.columnName}}>ชื่อ-สกุล</th>
//                 {clos.map((clo) => (
//                   <th 
//                     key={clo.assignment_clo_id} 
//                     style={{...styles.tableHeaderCell, ...styles.columnScore}}
//                     onMouseEnter={() => showTooltip(clo.assignment_clo_id)}
//                     onMouseLeave={() => hideTooltip(clo.assignment_clo_id)}
//                   >
//                     <div style={styles.cloHeader}>
//                       <span>{clo.CLO_code}</span>
//                       <br />
//                       <span>(คะแนนเต็ม: {clo.max_score})</span>
//                       <div style={{
//                         ...styles.tooltip,
//                         ...(tooltips[clo.assignment_clo_id] ? styles.tooltipVisible : {})
//                       }}>
//                         {clo.CLO_name} (น้ำหนัก: {clo.weight}%)
//                       </div>
//                     </div>
//                   </th>
//                 ))}
//                 <th style={{...styles.tableHeaderCell, ...styles.columnAction}}>การจัดการ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((student, index) => (
//                 <tr key={student.student_id}>
//                   <td style={styles.tableCell}>{index + 1}</td>
//                   <td style={styles.tableCell}>{student.student_id}</td>
//                   <td style={styles.tableCell}>{student.name || ''}</td>
//                   {clos.map((clo) => {
//                     // ตรวจสอบและเตรียมค่าคะแนนที่จะแสดง
//                     const scoreValue = scores[student.student_id] && 
//                                     scores[student.student_id][clo.assignment_clo_id] !== undefined
//                       ? scores[student.student_id][clo.assignment_clo_id]
//                       : 0;
                    
//                     return (
//                       <td key={`${student.student_id}-${clo.assignment_clo_id}`} style={styles.scoreCell}>
//                         <input
//                           type="number"
//                           min="0"
//                           max={clo.max_score}
//                           step="0.5"
//                           style={styles.scoreInput}
//                           value={scoreValue}
//                           onChange={(e) => handleScoreChange(
//                             student.student_id, 
//                             clo.assignment_clo_id, 
//                             e.target.value
//                           )}
//                         />
//                       </td>
//                     );
//                   })}
//                   <td style={{...styles.tableCell, textAlign: 'center'}}>
//                     <button
//                       style={styles.dangerButton}
//                       onClick={() => openConfirmRemoveModal(student.student_id, student.name || '')}
//                     >
//                       ลบ
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : !isEditing ? (
//         <div style={styles.emptyState}>
//           <h2>ไม่พบรายชื่อนักเรียนใน Assignment นี้</h2>
//           <p>กรุณาเพิ่มรายชื่อนักเรียนใน Assignment ก่อน</p>
//         </div>
//       ) : null}
      
//       {/* แสดงข้อความแจ้งเตือน */}
//       {alert.show && (
//         <div style={{
//           ...styles.alert,
//           ...(alert.type === 'success' ? styles.alertSuccess : 
//              alert.type === 'error' ? styles.alertError : 
//              styles.alertInfo)
//         }}>
//           {alert.message}
//         </div>
//       )}
      
//       {/* Modal ยืนยันการลบนักเรียน */}
//       {confirmModal.show && (
//         <div style={styles.modalBackdrop}>
//           <div style={styles.modalContent}>
//             <div style={styles.modalHeader}>
//               <h3 style={styles.modalTitle}>ยืนยันการลบนักเรียน</h3>
//             </div>
//             <div style={styles.modalBody}>
//               <p>คุณต้องการลบนักเรียน <strong>{confirmModal.studentName}</strong> (รหัส {confirmModal.studentId}) ออกจาก Assignment นี้หรือไม่?</p>
//               <p>การลบจะทำให้คะแนนทั้งหมดของนักเรียนคนนี้หายไปด้วย และไม่สามารถกู้คืนได้</p>
//             </div>
//             <div style={styles.modalFooter}>
//               <button 
//                 style={styles.cancelButton} 
//                 onClick={closeConfirmModal}
//                 disabled={removing}
//               >
//                 ยกเลิก
//               </button>
//               <button 
//                 style={styles.confirmButton} 
//                 onClick={removeStudentFromAssignment}
//                 disabled={removing}
//               >
//                 {removing ? 'กำลังลบ...' : 'ยืนยันการลบ'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignmentDetail;