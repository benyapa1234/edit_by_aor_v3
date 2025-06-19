import { useEffect, useState } from "react";
import ChooseCourse from "../ChooseCourse";
import styles from "./styles/CloPloMapping.module.css";
import axios from "./../axios";

export default function CloPloMapping({
  selectedProgram,
  selectedYear,
  selectedSemester,
}) {
  const [courseArray, setCourseArray] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [plos, setPlos] = useState([]);
  const [clos, setClos] = useState([]);
  const [mappingState, setMappingState] = useState({});
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [selectedSemester]);

  useEffect(() => {
    setMappingState({});
    fetchClos();
    fetchPlos();
    if (selectedCourse) {
      fetchMapping(); // ✅ ดึง mapping ด้วย
    }
  }, [selectedCourse]);

  useEffect(() => {
    console.log(mappingState);
  }, [mappingState]);

  function getTotalWeight(cloId) {
    const ploMap = mappingState[cloId] || {};
    return Object.values(ploMap).reduce((sum, { weight }) => sum + (weight || 0), 0);
  }

  async function fetchMapping() {
    try {
      const response = await axios.get("/api/plo/mapping", {
        params: {
          course_id: selectedCourse,
          year: selectedYear,
        },
      });

      const mappings = {};
      response.data.forEach(({ clo_id, plo_id, weight }) => {
        if (!mappings[clo_id]) {
          mappings[clo_id] = {};
        }
        mappings[clo_id][plo_id] = { weight: weight };
      });
      setMappingState(mappings);
    } catch (error) {
      console.error("Error loading CLO-PLO mappings:", error);
    }
  }

  async function fetchCourses() {
    try {
      const response = await axios.get("/api/program-course/detail", {
        params: {
          program_id: selectedProgram,
          year: selectedYear,
        },
      });
      setCourseArray(response.data);
    } catch (error) {
      setCourseArray([]);
      console.error(error);
    }
  }

  async function fetchPlos() {
    try {
      const response = await axios.get("/api/plo", {
        params: { program_id: selectedProgram, year: selectedYear },
      });
      setPlos(response.data);
    } catch (error) {
      setPlos([]);
      console.error(error);
    }
  }

  async function fetchClos() {
    try {
      const response = await axios.get("/api/clo/course", {
        params: {
          course_id: selectedCourse,
          year: selectedYear,
        },
      });
      setClos(response.data.data);
    } catch (error) {
      setClos([]);
      console.error(error);
    }
  }

  function handleToggleCheckbox(ploId, cloId) {
    setMappingState((prev) => {
      const cloMapping = prev[cloId] || {};
      const newMapping = { ...cloMapping };

      if (newMapping[ploId]) {
        delete newMapping[ploId]; // ถ้าเลือกซ้ำให้ลบออก
      } else {
        newMapping[ploId] = { weight: 0 };
      }

      return {
        ...prev,
        [cloId]: newMapping,
      };
    });
  }

  function handleWeightChange(cloId, ploId, value) {
  setMappingState((prev) => ({
    ...prev,
    [cloId]: {
      ...prev[cloId],
      [ploId]: {
        weight: parseInt(value) || 0,
      },
    },
  }));
}

  async function handleSubmit() {
  // สร้าง payload ใหม่จาก mappingState แบบ nested
    const payload = [];

    Object.entries(mappingState).forEach(([cloId, ploMap]) => {
      Object.entries(ploMap).forEach(([ploId, { weight }]) => {
        payload.push({
          clo_id: parseInt(cloId),
          plo_id: parseInt(ploId),
          weight: weight,
        });
      });
    });

    // ตรวจสอบว่า weight > 0 ทุกตัว
    const isValid = payload.every((item) => item.weight > 0);
    if (!isValid) {
      alert("Please enter a weight greater than 0 for each mapping.");
      return;
    }

    for (const clo of clos) {
      const total = getTotalWeight(clo.CLO_id);
      // ข้ามถ้า total = 0 แปลว่าไม่ได้เลือก mapping เลย
      if (total === 0) continue;

      if (total !== 100) {
        alert(`Total weight for ${clo.CLO_code} must be exactly 100%. Currently: ${total}%`);
        return;
      }
    }

    try {
      console.log("SUBMIT payload", {
      year: parseInt(selectedYear),
      course_id: parseInt(selectedCourse),
      mappings: payload,
    });

      const response = await axios.post("/api/plo/save", {     
        year: selectedYear,
        course_id: selectedCourse, // ✅ เพิ่มตรงนี้
        mappings: payload,
      });

      if (response.status === 200) {
        alert("Mapping saved successfully!");
      } else {
        alert("Something went wrong while saving mappings.");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Error saving mappings. Please try again.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.selector}>
        <ChooseCourse
          courseArray={courseArray}
          onChange={(e) => setSelectedCourse(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.mappingTable}>
          <thead>
            <tr>
              <th></th>
              {plos.map((plo, index) => (
                <th key={index}>{plo.PLO_code}</th>
              ))}
              <th>Total PLO</th>
            </tr>
          </thead>
          <tbody>
            {clos.map((clo, index) => (
              <tr key={index}>
                <th>{clo.CLO_code}</th>
                {plos.map((plo) => {
                  const key = `${plo.PLO_id}_${clo.CLO_id}`;
                  const isChecked = !!mappingState[clo.CLO_id]?.[plo.PLO_id];
                  const weight = mappingState[clo.CLO_id]?.[plo.PLO_id]?.weight || "";

                  return (
                    <td key={key} className={styles.mappingCell}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCheckbox(plo.PLO_id, clo.CLO_id)}
                      />
                      {isChecked && (
                        <>
                          <input
                            type="number"
                            className={styles.weightInput}
                            placeholder="%"
                            value={weight}
                            onChange={(e) =>
                              handleWeightChange(clo.CLO_id, plo.PLO_id, e.target.value)
                            }
                            style={{ width: "50px", marginRight: "5px" }}
                          />
                          <span>{weight}%</span> {/* แสดงน้ำหนักข้างๆ input */}
                        </>
                      )}
                    </td>
                  );
                })}
                <td>
        <strong>{getTotalWeight(clo.CLO_id)}%</strong> {/* ✅ แสดงผลรวม */}
      </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.submitWrapper}>
        <button onClick={handleSubmit} className={styles.submitButton}>
          Submit
        </button>
      </div>
    </div>
  );
}
