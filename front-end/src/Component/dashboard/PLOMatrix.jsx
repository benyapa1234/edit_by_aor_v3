import React from "react";

function PLOMatrix({ studentPLOData, courseList }) {
  // สร้างตาราง Heat Map สำหรับ PLO per Course Matrix
  const renderPLOMatrix = () => {
    if (
      !studentPLOData.coursePLOMatrix ||
      !courseList ||
      courseList.length === 0
    ) {
      return null;
    }

    // คิดข้อมูล PLO ที่มีในทุกรายวิชา
    const allPLOs = new Set();
    Object.values(studentPLOData.coursePLOMatrix).forEach((courseData) => {
      Object.keys(courseData).forEach((plo) => allPLOs.add(plo));
    });
    const ploArray = Array.from(allPLOs).sort();

    if (ploArray.length === 0) {
      return <div className="text-center">ไม่มีข้อมูล PLO Matrix</div>;
    }

    return (
      <div className="plo-matrix-container mt-4">
        <h5 className="text-center mb-3">PLO Matrix แยกตามรายวิชา</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>รายวิชา</th>
                {ploArray.map((plo) => (
                  <th key={plo}>{plo}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courseList.map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  {ploArray.map((plo) => {
                    const value =
                      studentPLOData.coursePLOMatrix[course.id]?.[plo] || 0;

                    // คำนวณสีตามค่า value
                    let cellStyle = {};
                    if (value > 0) {
                      // คำนวณสีเขียวถึงแดงตามค่า 0-100
                      const intensity = value / 100;
                      const red = Math.floor((1 - intensity) * 255);
                      const green = Math.floor(intensity * 255);
                      cellStyle = {
                        backgroundColor: `rgba(${red}, ${green}, 100, 0.7)`,
                        color: value > 50 ? "black" : "white",
                        fontWeight: "bold",
                      };
                    }

                    return (
                      <td key={`${course.id}-${plo}`} style={cellStyle}>
                        {value > 0 ? `${value}%` : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return renderPLOMatrix();
}

export default PLOMatrix;
