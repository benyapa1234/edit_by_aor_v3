// ExcelService.js - Frontend utility for handling Excel import/export

import * as XLSX from 'xlsx';

class ExcelService {
  /**
   * Generate an Excel template for student scores
   * @param {Object} assignment - Assignment details
   * @param {Array} clos - Array of CLO objects
   * @param {Array} students - Array of student objects
   * @param {Object} scores - Current scores object
   * @returns {Blob} Excel file as a Blob
   */
  static generateScoresTemplate(assignment, clos, students, scores) {
    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([]);
    
    // Prepare headers
    const headers = ['Student ID', 'Student Name'];
    clos.forEach(clo => {
      headers.push(`${clo.CLO_code} (max: ${clo.max_score})`);
    });
    
    // Add header row
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });
    
    // Add student data
    const data = students.map(student => {
      const row = [student.student_id, student.student_name];
      
      clos.forEach(clo => {
        row.push(scores[student.student_id]?.[clo.assignment_clo_id] || 0);
      });
      
      return row;
    });
    
    XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A2' });
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scores');
    
    // Generate Excel file
    const filename = `${assignment?.assignment_name || 'Assignment'}_Scores_Template.xlsx`;
    XLSX.writeFile(wb, filename);
    
    return filename;
  }
  
  /**
   * Read and parse an Excel file
   * @param {File} file - Excel file to read
   * @returns {Promise<Array>} Parsed data as a 2D array
   */
  static readExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
  
  /**
   * Process Excel data and map to student scores
   * @param {Array} data - Excel data as 2D array
   * @param {Array} clos - Array of CLO objects
   * @param {Array} students - Array of student objects 
   * @param {Object} currentScores - Current scores object
   * @returns {Object} Updated scores object
   */
  static processExcelData(data, clos, students, currentScores) {
    if (!data || data.length < 2) {
      throw new Error('Invalid Excel format');
    }
    
    // Extract header row (CLO IDs should be in this row)
    const headerRow = data[0];
    
    // Find the column index for student ID
    const studentIdColumnIndex = headerRow.findIndex(
      cell => cell && cell.toString().toLowerCase().includes('student') && 
             cell.toString().toLowerCase().includes('id')
    );
    
    if (studentIdColumnIndex === -1) {
      throw new Error('Student ID column not found in Excel');
    }
    
    // Map header columns to CLO IDs
    const cloColumns = {};
    
    headerRow.forEach((header, index) => {
      if (index !== studentIdColumnIndex) {
        // Look for a column header that matches a CLO code
        const matchingClo = clos.find(clo => 
          header && header.toString().includes(clo.CLO_code)
        );
        
        if (matchingClo) {
          cloColumns[index] = matchingClo.assignment_clo_id;
        }
      }
    });
    
    // Create a new scores object
    const newScores = { ...currentScores };
    
    // Process each row (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[studentIdColumnIndex]) continue;
      
      const studentId = row[studentIdColumnIndex].toString();
      // Skip if student not in our list
      if (!newScores[studentId]) continue;
      
      // Process each CLO column
      Object.entries(cloColumns).forEach(([columnIndex, cloId]) => {
        const score = parseFloat(row[columnIndex]) || 0;
        
        // Update score if it's a valid number between 0 and 100
        if (!isNaN(score) && score >= 0 && score <= 100) {
          newScores[studentId][cloId] = score;
        }
      });
    }
    
    return newScores;
  }
}

export default ExcelService;