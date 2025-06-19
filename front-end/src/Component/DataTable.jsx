import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DataTable = ({ data, onDataChange}) => {
  const [tableData, setTableData] = useState(data);


//ใช้ useEffect เพื่ออัปเดตสถานะ tableData เมื่อ prop data มีการเปลี่ยนแปลง
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // Handle input change 
  const handleInputChange = (rowIndex, key, value) => {
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [key]: value };
      }
      return row;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };
  

  // For no data
  if (!tableData || tableData.length === 0) {
    return <p>No data available.</p>;
  }

  // Get all unique keys from the data
  const allKeys = Array.from(new Set(tableData.flatMap((row) => Object.keys(row))));

  return (

    
    <div id="table-container" className="container mt-4">
      <table className="table table-bordered table-hover">
        {/* Header section */}
        <thead className="thead-dark">
          <tr>
            {allKeys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>

        {/* Body section */}
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {allKeys.map((key) => (
                <td key={key}>
                  <input
                    type="text"
                    className="form-control"
                    value={row[key] || ''}
                    onChange={(e) => handleInputChange(rowIndex, key, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
