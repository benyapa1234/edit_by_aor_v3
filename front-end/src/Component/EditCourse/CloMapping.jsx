import axios from "../axios";
import { useEffect, useState } from "react";

export default function CloMapping({
  handleEditToggle,
  editingScores,
  courseClo,
  selectedCourseId,
  courses,
  weightEachCourse,
  handleEditWeightEachCourse,
  role,
}) {
  const [id_array, setId_array] = useState();
  const [weightValues, setWeightValues] = useState(weightEachCourse);
  const [totalWeight, setTotalWeight] = useState(0);
  const [courseItem, setCourseItem] = useState({});
  function handleOnChange(newValue, index) {
    const updatedWeights = [...weightValues]; // สร้าง copy ใหม่แบบ shallow
    updatedWeights[index] = parseFloat(newValue) || 0; // ตรวจสอบค่า
    setWeightValues(updatedWeights);
    handleEditWeightEachCourse(updatedWeights); // หากต้องการส่งกลับไปยัง parent
  }

  function calculateTotalWeight() {
    let total = 0;
    for (let i = 0; i < weightValues.length; i++) {
      total += parseInt(weightValues[i]);
    }
    setTotalWeight(total);
  }

  useEffect(() => {
    fetchCourseById();
  }, []);

  useEffect(() => {
    normalizeCourseClo();
    setWeightValues(weightEachCourse);
  }, [weightEachCourse]);

  async function fetchCourseById() {
    try {
      const response = await axios.get(`/api/course/${selectedCourseId}`);
      setCourseItem(response.data[0]);
    } catch (error) {
      setCourseItem({});
      console.error(error);
    }
  }

  function normalizeCourseClo() {
    let result = [];
    const copyClo = courseClo;
    copyClo.map((data) => {
      result.push(data.course_clo_id);
    });
    setId_array(result);
  }

  useEffect(() => {
    calculateTotalWeight();
  }, [weightValues]);

  async function handleSubmit() {
    // สมมุติว่าคุณเก็บ id และ weight (หรือ score) แบบนี้
    let updates = [];
    for (let i = 0; i < weightValues.length; i++) {
      updates.push({
        id: id_array[i],
        score: parseInt(weightValues[i]),
      });
    }

    try {
      await axios.put("/api/clo-mapping/weight", {
        updates: [...updates],
      });
    } catch (error) {
      console.error("Error during update:", error);
    }
    handleEditToggle();
  }

  return (
    <>
      <h2 className="mt-3">Course-CLO Mapping</h2>
      {role === "Curriculum Admin" && (
        <div className="action-buttons mb-3">
          <button onClick={handleEditToggle} className="btn btn-primary me-2">
            {editingScores ? "Cancel Edit" : "Edit Course-CLO Mapping"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!editingScores}
            className="btn"
            style={{ backgroundColor: "#FF8C00", color: "white" }}>
            Submit Course-CLO Scores
          </button>
        </div>
      )}

      {/* <TableEditCloWeight /> */}
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
              colSpan={courseClo.length}>
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
            {courseClo.map((clo) => (
              <th
                key={`header-${clo.CLO_code}`}
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
          {courseItem && (
            <tr key={courseItem.course_id}>
              <td
                style={{
                  border: "1px solid black",
                  padding: "10px",
                }}>
                {courseItem.course_id} {courseItem.course_name}
              </td>
              {weightValues &&
                weightValues.map((weight, index) => {
                  return (
                    <td
                      key={index}
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
                          value={weight || 0}
                          style={{
                            width: "60px",
                            padding: "5px",
                            textAlign: "center",
                          }}
                          onChange={(e) =>
                            handleOnChange(e.target.value, index)
                          }
                        />
                      ) : (
                        weight || 0
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
                {totalWeight}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

{
  /* {editingScores ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={weight.weight || 0}
                                onChange={(e) =>
                                  handleEditWeightEachCourse(
                                    courseItem.course_id,
                                    value.clo_id,
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
                              // แสดงค่า weight หรือ 0 ถ้าไม่มีค่า
                              value?.weight || 0
                            )} */
}
