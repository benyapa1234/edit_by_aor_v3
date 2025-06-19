import SelectorInput from "./SelectorInput";
import axios from "./../axios";
import { useEffect, useState } from "react";
import styles from "./navbar.module.css";

export default function SelectorSection() {
  // Data Array for select
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);

  // Selected Data
  const [selectedUniversityId, setSelectedUniversityId] = useState(0);
  const [selectedFacultyId, setSelectedFacultyId] = useState(0);

  async function fetchUniversities() {
    try {
      const response = await axios.get("/api/university");
      const data = response.data;

      let dataArray = [];
      for (let i = 0; i < data.length; i++) {
        dataArray.push({
          key: data[i].university_id,
          text_th: data[i].university_name_th,
          text_eng: data[i].university_name_en,
          text_display: `${data[i].university_name_en} (${data[i].university_name_th})`,
        });
      }
      setUniversities(dataArray);
    } catch (error) {
      alert(error.message);
    }
  }

  async function fetchFaculties() {
    try {
      const response = await axios.get(
        `/api/university/faculty/${selectedUniversityId}`
      );
      const data = response.data;
      let dataArray = [];
      for (let i = 0; i < data.length; i++) {
        dataArray.push({
          key: data[i].faculty_id,
          text_th: data[i].faculty_name_th,
          text_eng: data[i].faculty_name_en,
          text_display: `${data[i].faculty_name_en} (${data[i].faculty_name_th})`,
        });
      }
      setFaculties(dataArray);
    } catch (error) {
      alert(error.message);
    }
  }

  async function fetchCourses() {}

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    setFaculties([]);
    setSelectedFacultyId(0);
    fetchFaculties();
  }, [selectedUniversityId]);

  useEffect(() => {
    setCourses([]);
    setSelectedCourseId(0);
  }, [selectedFacultyId]);

  return (
    <div className={`${styles.selector_container}`}>
      <SelectorInput
        selectorArray={universities}
        headerText="University"
        data={selectedUniversityId}
        setData={setSelectedUniversityId}
        defaultText="กรุณาเลือกมหาวิทยาลัย"
        width={"300px"}
      />
      <SelectorInput
        selectorArray={faculties}
        headerText="Faculty"
        data={selectedFacultyId}
        setData={setSelectedFacultyId}
        defaultText="กรุณาเลือกคณะ"
        width={"350px"}
      />
    </div>
  );
}
