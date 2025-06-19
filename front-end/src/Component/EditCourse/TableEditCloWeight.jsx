import React, { useState } from "react";

export default function TableEditCloWeight() {
  const [mockCourses] = useState([
    { course_id: "C001", course_name: "Introduction to Programming" },
    { course_id: "C002", course_name: "Data Structures" },
    { course_id: "C003", course_name: "Web Development" },
  ]);

  const [selectedCourseId] = useState("C001"); // เปลี่ยนค่านี้เพื่อทดสอบแต่ละวิชา

  const [courseClo] = useState([
    // C001
    { course_id: "C001", CLO_id: 1, CLO_code: "CLO01" },
    { course_id: "C001", CLO_id: 2, CLO_code: "CLO02" },
    { course_id: "C001", CLO_id: 3, CLO_code: "CLO03" },
    // C002
    { course_id: "C002", CLO_id: 1, CLO_code: "CLO01" },
    { course_id: "C002", CLO_id: 2, CLO_code: "CLO02" },
    // C003
    { course_id: "C003", CLO_id: 1, CLO_code: "CLO01" },
    { course_id: "C003", CLO_id: 2, CLO_code: "CLO02" },
    { course_id: "C003", CLO_id: 3, CLO_code: "CLO03" },
    { course_id: "C003", CLO_id: 4, CLO_code: "CLO04" },
  ]);

  const [weightEachCourse, setWeightEachCourse] = useState({
    aC001_1: { clo_id: 1, weight: 30 },
    aC001_2: { clo_id: 2, weight: 40 },
    aC001_3: { clo_id: 3, weight: 30 },

    aC002_1: { clo_id: 1, weight: 50 },
    aC002_2: { clo_id: 2, weight: 50 },

    aC003_1: { clo_id: 1, weight: 20 },
    aC003_2: { clo_id: 2, weight: 25 },
    aC003_3: { clo_id: 3, weight: 30 },
    aC003_4: { clo_id: 4, weight: 25 },
  });

  const editingScores = true;

  const calculateTotal = (courseId) => {
    let total = 0;
    for (const key in weightEachCourse) {
      if (key.startsWith(`a${courseId}_`)) {
        total += Number(weightEachCourse[key].weight || 0);
      }
    }
    return total;
  };

  const handleEditWeightEachCourse = (courseId, cloId, newValue) => {
    const key = `a${courseId}_${cloId}`;
    setWeightEachCourse((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        weight: Number(newValue),
      },
    }));
  };

  return (
    <table
      className="table table-bordered"
      style={{
        borderCollapse: "collapse",
        width: "100%",
        marginTop: "15px",
        border: "2px solid black",
      }}>
      <thead>
        <tr>
          <th
            style={{
              border: "1px solid black",
              padding: "10px",
              textAlign: "center",
            }}
            rowSpan="2">
            Course
          </th>
          <th
            style={{
              border: "1px solid black",
              padding: "10px",
              textAlign: "center",
              backgroundColor: "#f2f2f2",
            }}
            colSpan={
              courseClo.filter((clo) => selectedCourseId === clo.course_id)
                .length
            }>
            CLO
          </th>
          <th
            style={{
              border: "1px solid black",
              padding: "10px",
              textAlign: "center",
            }}
            rowSpan="2">
            Total(100)
          </th>
        </tr>
        <tr>
          {courseClo
            .filter((clo) => selectedCourseId === clo.course_id)
            .map((clo) => (
              <th
                key={`header-${clo.CLO_id}-${clo.CLO_code}`}
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  textAlign: "center",
                }}>
                {clo.CLO_code}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {mockCourses
          .filter((courseItem) => courseItem.course_id === selectedCourseId)
          .map((courseItem) => (
            <tr key={courseItem.course_id}>
              <td
                style={{
                  border: "1px solid black",
                  padding: "10px",
                }}>
                {courseItem.course_id} {courseItem.course_name}
              </td>
              {courseClo
                .filter((clo) => clo.course_id === selectedCourseId)
                .map((clo) => {
                  const key = `a${courseItem.course_id}_${clo.CLO_id}`;
                  const value = weightEachCourse[key];

                  return (
                    <td
                      key={key}
                      style={{
                        border: "1px solid black",
                        padding: "10px",
                        textAlign: "center",
                      }}>
                      {editingScores ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={value?.weight || 0}
                          onChange={(e) =>
                            handleEditWeightEachCourse(
                              courseItem.course_id,
                              clo.CLO_id,
                              e.target.value
                            )
                          }
                          style={{
                            width: "60px",
                            padding: "5px",
                            textAlign: "center",
                          }}
                        />
                      ) : (
                        value?.weight || 0
                      )}
                    </td>
                  );
                })}
              <td
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}>
                {calculateTotal(courseItem.course_id)}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
