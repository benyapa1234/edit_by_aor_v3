import React, { useState, useEffect } from "react";
import axios from "./axios";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddCourse from "./EditCourse/AddCourse";
import EditCourse from "./EditCourse/EditCourse";
import CourseTable from "./EditCourse/CourseTable";
import TableEditCloWeight from "./EditCourse/TableEditCloWeight";
import CloMapping from "./EditCourse/CloMapping";
import Assignment from "./EditCourse/Assignment";
import CloTable from "./EditCourse/CloTable";
import SelectorSection from "./navbar/SelectorSection";
import CloPloMapping from "./EditCourse/CloPloMapping";

export default function Course() {
  const [selectedPlo, setSelectedPlo] = useState(null);
  const [course, setCourse] = useState([]);
  const [newCourse, setNewCourse] = useState({
    course_id: "",
    course_name: "",
    course_engname: "",
    program_id: "",
    year: "",
    section: "",
    semester_id: "",
  });
  const [editCourse, setEditCourse] = useState({
    course_id: "",
    course_name: "",
    course_engname: "",
    program_id: "",
    year: "",
    section: "",
    semester_id: "",
  });

  const [activeTab, setActiveTab] = useState(0);

  const { t, i18n } = useTranslation();
  const [semesters, setSemesters] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [facultys, setFacultys] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [allFiltersSelected, setAllFiltersSelected] = useState(false);

  // Changed from plos to clos
  const [editingScores, setEditingScores] = useState(false);
  const [clos, setClos] = useState([]);
  const [weights, setWeights] = useState({});
  const [scores, setScores] = useState({});
  const [showMapping, setShowMapping] = useState(false);

  // CLO Management States from Second File
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [mappings, setMappings] = useState([]);
  const [CLOs, setCLOs] = useState([]);
  const [plos, setPlos] = useState([]);
  const [editClo, setEditClo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCloName, setEditCloName] = useState("");
  const [editCloEngName, setEditCloEngName] = useState("");
  const [editCloCode, setEditCloCode] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [previousYearCLOs, setPreviousYearCLOs] = useState([]);
  const [showPreviousYearCLOsModal, setShowPreviousYearCLOsModal] =
    useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false); // เพิ่ม maodal
  const [allPLOs, setAllPLOs] = useState([]);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [programCourseData, setProgramCourseData] = useState({
    courses: [],
    sections: [],
    semesters: [],
    years: [],
  });

  const [fileUploaded, setFileUploaded] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [assignmentName, setAssignmentName] = useState("");
  const [isEditing, setIsEditing] = useState(false); // เพิ่มตรงนี้

  // Step 2: CLO Scoring System state
  const [homeworks, setHomeworks] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [cloWeights, setCloWeights] = useState({});

  // Step 3: Import Students state
  const [importedStudents, setImportedStudents] = useState([]);
  const [clipboardText, setClipboardText] = useState("");
  const [importErrors, setImportErrors] = useState([]);
  const [importSuccess, setImportSuccess] = useState("");
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null);

  // Other state variables
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [students, setStudents] = useState([]);

  const [weightDisplay, setWeightDisplay] = useState([]);
  const [courseClo, setCourseClo] = useState({});
  const [weightEachCourse, setWeightEachCourse] = useState({});
  const [saving, setSaving] = useState(false);
  const [assignment, setAssignment] = useState({});
  const [editData, setEditData] = useState({
    assignment_name: "",
    course_name: "",
    section_id: "",
    semester_id: "",
    year: "",
    program_id: "",
    faculty_id: "",
    university_id: "",
  });
  const [selectedCourseClo, setSelectedCourseClo] = useState([
    {
      course_id: "",
      course_name: "",
      course_engname: "",
      program_id: "",
      year: "",
      semester_id: "",
    },
  ]);

  const [allSections, setAllSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [allWeights, setAllWeights] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedProgramCourse, setSelectedProgramCourse] = useState();
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState();
  const [role, setRole] = useState();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get("/university");
        // ตรวจสอบว่าข้อมูลเป็น array หรือไม่ ถ้าไม่ใช่ให้แปลงเป็น array ก่อน
        const universityData = Array.isArray(response.data)
          ? response.data
          : [response.data].filter(Boolean);
        setUniversities(universityData);
        // console.log("Universities loaded:", universityData);
      } catch (error) {
        console.error("Error fetching universities:", error);
        alert("ไม่สามารถโหลดรายชื่อมหาวิทยาลัยได้");
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };
    const role_local = localStorage.getItem("user_role");
    setRole(role_local);
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (!selectedUniversity) {
      setFacultys([]);
      setSelectedFaculty("");
      return;
    }

    // console.log("Fetching faculties for university ID:", selectedUniversity);

    const fetchFaculties = async () => {
      try {
        const response = await axios.get(
          `/faculty?university_id=${selectedUniversity}`
        );
        // console.log("Response from faculty API:", response);
        const facultyData = Array.isArray(response.data)
          ? response.data
          : [response.data].filter(Boolean);
        // console.log("Processed Faculty Data:", facultyData);
        setFacultys(facultyData);
      } catch (error) {
        console.error("Error fetching faculties:", error);
        alert("ไม่สามารถโหลดคณะได้");
        setFacultys([]);
        setSelectedFaculty("");
      }
    };

    fetchFaculties();
  }, [selectedUniversity]);

  useEffect(() => {
    if (activeTab === 3) {
      fetchPLOsForProgram();

      // เรียกใช้ fetchPLOCLOMappings หากมีข้อมูลที่จำเป็นครบถ้วน
      if (
        selectedProgram &&
        selectedCourseId &&
        selectedSemesterId &&
        selectedYear
      ) {
        fetchPLOCLOMappings();
      }
    } else if (activeTab === 1 && !selectedCourseId) {
      setSelectedCourseClo([]);
    }
    fetchCourses();
  }, [
    activeTab,
    selectedCourseId,
    selectedSemesterId,
    selectedYear,
    selectedProgram,
  ]);

  useEffect(() => {
    if (courseClo.length > 0 && activeTab === 2) {
      setShowMapping(true);
    }
  }, [courseClo]);

  // แก้ไขการเรียกใช้ API เพื่อดึงข้อมูลโปรแกรม
  useEffect(() => {
    if (!selectedFaculty) {
      setPrograms([]);
      setSelectedProgram("");
      return;
    }

    // console.log("Fetching programs for faculty ID:", selectedFaculty);

    const fetchPrograms = async () => {
      try {
        const response = await axios.get(
          `/program?faculty_id=${selectedFaculty}`
        );
        // ตรวจสอบและแปลงข้อมูลให้เป็น array เสมอ
        const programData = Array.isArray(response.data)
          ? response.data
          : [response.data].filter(Boolean);

        // console.log("Programs loaded:", programData);
        setPrograms(programData);

        // ตรวจสอบว่าค่าที่เลือกอยู่ยังมีอยู่ในข้อมูลใหม่หรือไม่
        if (
          programData.length > 0 &&
          !programData.some((p) => p.program_id.toString() === selectedProgram)
        ) {
          setSelectedProgram("");
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        alert("ไม่สามารถโหลดหลักสูตรได้");
        setPrograms([]);
        setSelectedProgram("");
      }
    };

    fetchPrograms();
  }, [selectedFaculty]);

  // แก้ไขการดึงข้อมูลปีและหารายวิชาตามโปรแกรม
  useEffect(() => {
    if (!selectedProgram) {
      setYears([]);
      setSelectedYear("");
      return;
    }

    // console.log("Finding years for program ID:", selectedProgram);

    const fetchYearsForProgram = async () => {
      try {
        // หาโปรแกรมที่เลือกจาก programs
        const selectedProgramData = programs.find(
          (p) => p.program_id.toString() === selectedProgram.toString()
        );

        if (!selectedProgramData) {
          console.error("Selected program not found in programs array");
          setYears([]);
          setSelectedYear("");
          return;
        }

        // หาชื่อของโปรแกรมที่เลือก
        const selectedProgramName = selectedProgramData.program_name;

        // ค้นหาทุกโปรแกรมที่มีชื่อเดียวกัน
        const programsWithSameName = programs.filter(
          (p) => p.program_name === selectedProgramName
        );

        // ดึงปีการศึกษาจากทุกโปรแกรมที่มีชื่อเดียวกัน
        const availableYears = programsWithSameName
          .map((p) => p.year)
          .filter((year) => year != null);

        // เรียงลำดับปีการศึกษาและลบค่าซ้ำ
        const uniqueYears = [...new Set(availableYears)].sort((a, b) => a - b);

        // console.log("Available years for selected program:", uniqueYears);
        setYears(uniqueYears);

        // ตรวจสอบว่าปีที่เลือกไว้ยังอยู่ในรายการปีใหม่หรือไม่
        if (
          uniqueYears.length > 0 &&
          !uniqueYears.includes(parseInt(selectedYear))
        ) {
          setSelectedYear("");
        }
      } catch (error) {
        console.error("Error fetching years:", error);
        setYears([]);
        setSelectedYear("");
      }
    };

    fetchYearsForProgram();
  }, [selectedProgram, programs]);

  // ตรวจสอบว่าฟิลเตอร์ทั้งหมดถูกเลือกหรือไม่
  useEffect(() => {
    if (
      selectedUniversity &&
      selectedFaculty &&
      selectedYear &&
      selectedProgram
    ) {
      setAllFiltersSelected(true);

      // Update newCourse state with selected filters
      setNewCourse((prev) => ({
        ...prev,
        university_id: selectedUniversity,
        faculty_id: selectedFaculty,
        year: selectedYear,
        program_id: selectedProgram,
      }));
    } else {
      setAllFiltersSelected(false);

      // Reset related data when filters are incomplete
      setCourse([]);
    }
  }, [selectedUniversity, selectedFaculty, selectedYear, selectedProgram]);

  // แก้ไขการดึงข้อมูล CLO เมื่อเลือกรายวิชา
  useEffect(() => {
    if (
      selectedCourseId &&
      selectedSemesterId &&
      selectedYear &&
      selectedProgram
    ) {
      if (activeTab === 1) {
        fetchFilteredCourseClo();
      } else if (activeTab === 2) {
        fetchFilteredCourseClo();
        fetchWeight();
      } else if (activeTab === 3) {
        fetchFilteredCourseClo();
        fetchAllSectionByCourse();
      } else if (activeTab === 4) {
        fetchAllSectionByCourse();
      }
    } else {
      setCLOs([]);
      setMappings([]);
      setPlos([]);
      setSelectedCourseId();
      if (activeTab === 3) {
        setSelectedSectionId();
      }
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (!selectedYear) return;
  }, [selectedYear]);

  useEffect(() => {
    if (activeTab === 3) {
      fetchPLOsForProgram();
      refreshDataAndMappings();
    }
  }, [selectedSectionId]);

  // ดึงข้อมูลหลักสูตรและภาคเรียนเมื่อเริ่มต้นใช้งาน
  useEffect(() => {
    const initializePage = async () => {
      await fetchAllPrograms(); // ดึงข้อมูลโปรแกรมทั้งหมด
      await fetchSemesters(); // ดึงข้อมูลภาคเรียน
    };

    initializePage();
  }, []);

  useEffect(() => {
    const updatedWeights = {};

    mappings.forEach((mapping) => {
      const key = `${mapping.PLO_id}-${mapping.CLO_id}`;
      updatedWeights[key] = mapping.weight ?? "-";
    });

    // console.log("Updated Weights:", updatedWeights);
    setWeights(updatedWeights);
  }, [mappings, CLOs]);

  // อัพเดต currentAssignmentId เมื่อ homeworks เปลี่ยน
  useEffect(() => {
    if (homeworks.length > 0 && homeworks[0].id) {
      setCurrentAssignmentId(homeworks[0].id);
      // console.log("Current Assignment ID set to:", homeworks[0].id);
    } else {
      setCurrentAssignmentId(null);
    }
  }, [homeworks]);

  // เพิ่มการตรวจสอบค่า PLO ID ใน useEffect เมื่อดึงข้อมูล
  useEffect(() => {
    if (!selectedSemesterId) {
      setSelectedCourseId();
      setCourseList([]);
      return;
    }
    fetchAllCourseByProgram(selectedProgram);
    fetchSelectCourse();
    setSelectedCourseId();
  }, [selectedSemesterId]);

  // ใช้ useEffect เพื่อโหลดข้อมูลตั้งต้นเมื่อเข้าสู่ Step 2
  useEffect(() => {
    if (currentStep === 2 && homeworks.length > 0) {
      // ถ้าอยู่ที่ Step 2 และมี homework แล้ว ให้ดึงข้อมูล weight
      fetchCourseWeights(selectedProgram);
    }
  }, [currentStep]);

  useEffect(() => {
    if (
      selectedCourseId &&
      selectedSemesterId &&
      selectedYear &&
      selectedProgram
    ) {
      if (activeTab == 2) {
        fetchWeight();
      }
    }
  }, [activeTab]);
  useEffect(() => {
    if (
      selectedCourseId &&
      selectedSemesterId &&
      selectedYear &&
      selectedProgram
    ) {
      if (activeTab === 3) {
        fetchAllSectionByCourse();
      }
    }
  }, [selectedCourseId, selectedSemesterId, selectedYear, activeTab]);

  async function fetchWeight() {
    try {
      const response = await axios.get("/api/clo-mapping/weight", {
        params: {
          course_id: selectedCourseId,
          semester_id: selectedSemesterId,
          year: selectedYear,
        },
      });
      setCourseClo(response.data);
      let weight_array = [];
      const result_array = response.data;
      result_array.map((data) => {
        weight_array.push(data.weight);
      });
      setAllWeights(weight_array);
    } catch (error) {
      setCourseClo([]);
      setAllWeights([]);
      console.error(error);
    }
  }

  const fetchCourseWeights = async (programId) => {
    try {
      if (
        !selectedCourseId ||
        !selectedSectionId ||
        !selectedSemesterId ||
        !selectedYear
      ) {
        // console.log("ไม่มีพารามิเตอร์ที่จำเป็นสำหรับการดึงข้อมูล weights");
        return;
      }

      // เปลี่ยนจาก '/course_clo' เป็น '/course_clo_with_weight' เพื่อดึงข้อมูล weight
      const response = await axios.get("/course_clo_with_weight", {
        params: {
          program_id: programId,
          course_id: selectedCourseId,
          section_id: selectedSectionId,
          semester_id: selectedSemesterId,
          year: selectedYear,
        },
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        setWeightEachCourse((prev) => {
          const newWeights = { ...prev };

          response.data.forEach((item) => {
            const cloId = item.CLO_id;
            const weight = item.weight || 0;

            if (cloId !== undefined) {
              const key = `a${selectedCourseId}_${cloId}`;
              newWeights[key] = {
                weight,
                clo_id: cloId,
                course_id: selectedCourseId,
              };
            }
          });

          return newWeights;
        });

        // เพิ่มการเก็บค่า weight ในอีกตัวแปรสำหรับใช้ในการคำนวณคะแนน
        const cloWeightsObj = {};
        response.data.forEach((item) => {
          cloWeightsObj[item.CLO_id] = item.weight || 0;
        });
        setCloWeights(cloWeightsObj);
      } else {
        // console.log("ไม่พบข้อมูล course_clo");
        setWeights({});
        setCloWeights({});
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล course_clo weights:", error);
      if (error.response) {
        console.error("รายละเอียดข้อผิดพลาด:", error.response.data);
      }
      setWeights({});
      setCloWeights({});
    }
  };

  const handleInputChange2 = (ploId, cloId, value) => {
    const key = `${ploId}-${cloId}`;

    // Create a copy of the current scores state
    const updatedScores = { ...scores };

    // Update the specific score value
    updatedScores[key] = parseInt(value, 10) || 0;

    // Set the updated scores
    setScores(updatedScores);
  };

  // ฟังก์ชันสำหรับดึง PLO ของโปรแกรม
  const fetchPLOsForProgram = async () => {
    try {
      if (!selectedProgram) {
        // console.log("No program selected for fetchPLOsForProgram");
        return;
      }

      const response = await axios.get(
        `/program_plo?program_id=${selectedProgram}`
      );
      // console.log("PLO response:", response.data);

      // ปรับแต่งข้อมูลให้มีฟิลด์ PLO_id
      let formattedPLOs = [];
      const data = response.data;

      if (data.success && Array.isArray(data.message)) {
        formattedPLOs = data.message.map((plo) => ({
          ...plo,
          PLO_id: plo.PLO_id || plo.plo_id,
        }));
      } else if (Array.isArray(data)) {
        formattedPLOs = data.map((plo) => ({
          ...plo,
          PLO_id: plo.PLO_id || plo.plo_id,
        }));
      } else if (data) {
        formattedPLOs = [
          {
            ...data,
            PLO_id: data.PLO_id || data.plo_id,
          },
        ];
      }

      // console.log("Formatted PLOs:", formattedPLOs);
      setAllPLOs(formattedPLOs);
    } catch (error) {
      console.error("Error fetching PLOs:", error);
      setAllPLOs([]);
    }
  };

  useEffect(() => {
    if (
      selectedCourseId &&
      selectedSectionId &&
      selectedSemesterId &&
      selectedYear &&
      selectedProgram &&
      activeTab === 3
    ) {
      fetchPLOCLOMappings();
    }
  }, [selectedSectionId, activeTab]);

  useEffect(() => {
    if (
      selectedCourseId &&
      selectedSemesterId &&
      selectedYear &&
      selectedProgram &&
      activeTab === 3
    ) {
      // First, fetch CLO data for the selected course
      const fetchCLOData = async () => {
        try {
          const response = await axios.get("/api/course-clo/filter", {
            params: {
              program_id: selectedProgram,
              course_id: selectedCourseId,
              semester_id: selectedSemesterId,
              year: selectedYear,
            },
          });
          setCLOs(response.data);
        } catch (error) {
          console.error("Error fetching CLO data:", error);
          setCLOs([]);
        }
      };

      // Fetch PLO data for the selected program
      const fetchPLOData = async () => {
        try {
          const response = await axios.get(
            `/program_plo?program_id=${selectedProgram}`
          );

          // Format PLO data consistently
          let formattedPLOs = [];
          const data = response.data;

          if (data.success && Array.isArray(data.message)) {
            formattedPLOs = data.message.map((plo) => ({
              ...plo,
              PLO_id: plo.PLO_id || plo.plo_id,
            }));
          } else if (Array.isArray(data)) {
            formattedPLOs = data.map((plo) => ({
              ...plo,
              PLO_id: plo.PLO_id || plo.plo_id,
            }));
          } else if (data) {
            formattedPLOs = [
              {
                ...data,
                PLO_id: data.PLO_id || data.plo_id,
              },
            ];
          }

          setAllPLOs(formattedPLOs);
        } catch (error) {
          console.error("Error fetching PLO data:", error);
          setAllPLOs([]);
        }
      };

      // Fetch CLO-PLO mappings
      const fetchMappingData = async () => {
        try {
          const response = await axios.get("/plo_clo", {
            params: {
              program_id: selectedProgram,
              course_id: selectedCourseId,
              semester_id: selectedSemesterId,
              year: selectedYear,
            },
          });

          // Format mapping data
          const formattedMappings = Array.isArray(response.data)
            ? response.data
            : [response.data].filter(Boolean);

          setMappings(formattedMappings);

          // Update weights from mappings
          const updatedWeights = {};
          formattedMappings.forEach((mapping) => {
            const ploId = mapping.PLO_id || mapping.plo_id;
            const cloId = mapping.CLO_id || mapping.clo_id;

            if (ploId && cloId) {
              const key = `${ploId}-${cloId}`;
              updatedWeights[key] = mapping.weight || 0;
            }
          });

          setWeights(updatedWeights);
        } catch (error) {
          console.error("Error fetching mapping data:", error);
          setMappings([]);
          setWeights({});
        }
      };

      // Fetch sections for the selected course
      const fetchSectionData = async () => {
        try {
          const response = await axios.get("/api/clo-mapping", {
            params: {
              semester_id: selectedSemesterId,
              course_id: selectedCourseId,
              year: selectedYear,
            },
          });
          setAllSections(response.data);
        } catch (error) {
          console.error("Error fetching section data:", error);
          setAllSections([]);
        }
      };

      // Execute all fetch operations
      const fetchAllData = async () => {
        await fetchCLOData();
        await fetchPLOData();
        await fetchSectionData();

        // Only fetch mappings if section is selected
        if (selectedSectionId) {
          await fetchMappingData();
        }
      };

      fetchAllData();
    }
  }, [
    selectedCourseId,
    selectedSectionId,
    selectedSemesterId,
    selectedYear,
    selectedProgram,
    activeTab,
  ]);

  // ฟังก์ชันสำหรับหาโปรแกรมที่ไม่ซ้ำกัน
  const getUniquePrograms = (programsArray) => {
    // ใช้ Set เพื่อเก็บ key ที่ไม่ซ้ำกัน (program_name)
    const uniquePrograms = [];
    const seenNames = new Set();

    programsArray.forEach((program) => {
      // ใช้ program_name เป็น key
      const programName = program.program_name;

      // ถ้ายังไม่เคยเห็นชื่อนี้ ให้เพิ่มเข้าไปในรายการ
      if (!seenNames.has(programName)) {
        seenNames.add(programName);
        uniquePrograms.push(program);
      }
    });

    return uniquePrograms;
  };

  async function fetchAllSectionByCourse() {
    try {
      const response = await axios.get("/api/clo-mapping", {
        params: {
          semester_id: selectedSemesterId,
          course_id: selectedCourseId,
          year: selectedYear,
        },
      });
      setAllSections(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  // ฟังก์ชันดึงข้อมูลรายวิชาตามโปรแกรมและภาคเรียน
  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/course/filter", {
        params: {
          semester_id: selectedSemesterId,
          year: selectedYear,
        },
      });
      setCourses(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourse([]);
    }
  };

  // ฟังก์ชันดึงข้อมูลภาคเรียนและลบข้อมูลซ้ำ
  const fetchSemesters = async () => {
    try {
      const response = await axios.get("/semesters");

      if (!response.data) {
        console.warn("Invalid or empty response for semesters");
        setSemesters([]);
        return;
      }
      const uniqueSemesters = getUniqueSemesters(response.data);
      setSemesters(uniqueSemesters || []);
    } catch (err) {
      console.error("Error fetching semesters:", err);
      setSemesters([]);
    }
  };

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);

    // รีเซ็ตค่าที่เกี่ยวข้องกับการแก้ไข เมื่อสลับแท็บ
    if (editingScores) {
      setEditingScores(false);
      setScores({});
    }

    // เคลียร์ข้อมูลตามแท็บที่เลือก
    if (tabIndex === 4) {
      // แท็บ Assignment
      // ไม่ต้องรีเซ็ตข้อมูลทั้งหมดเพื่อให้สามารถกลับมาดูข้อมูลเดิมได้
      setCurrentStep(1);
      setError(null);

      // ในกรณีที่มีการเลือก Assignment ให้ล้างค่า selectedAssignment
      setSelectedAssignment(null);
    }
  };

  // Helper function to filter out duplicate semesters
  const getUniqueSemesters = (semesters) => {
    const uniqueSemesterIds = [
      ...new Set(semesters.map((item) => item.semester_id)),
    ];
    return semesters.filter((semester) =>
      uniqueSemesterIds.includes(semester.semester_id)
    );
  };

  // ฟังก์ชันดึงข้อมูลโปรแกรมทั้งหมด
  const fetchAllPrograms = async () => {
    try {
      const response = await axios.get("/program");
      if (response.data && Array.isArray(response.data)) {
        setPrograms(response.data);
      } else {
        console.error("Invalid program data format");
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  // ฟังก์ชันสำหรับเปลี่ยนค่ารายวิชา
  const handleCourseChange = (e) => {
    const { name, value } = e.target;

    // อัพเดทค่าใน newCourse
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));

    // หากเป็นการเปลี่ยนภาคเรียน ให้อัพเดทค่า selectedSemesterId สำหรับแท็บ CLO ด้วย
    if (name === "semester_id") {
      setSelectedSemesterId(value);

      // หากมีการเลือกโปรแกรม ปี และภาคเรียนครบแล้ว ให้ดึงข้อมูลรายวิชา
      if (selectedProgram && selectedYear && value) {
        fetchCourses();
      }
    }
  };

  // ตรวจสอบฟังก์ชัน handleInputChange
  const handleInputChange = (courseId, cloId, value, weight) => {
    const key = `${courseId}_${cloId}`;
    setScores({ weight, [key]: value });
  };

  function handleEditWeightEachCourse(course_id, clo_id, newWeight) {
    const key = `a${course_id}_${clo_id}`;
    setWeightEachCourse((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        weight: newWeight, // แก้เฉพาะ weight
      },
    }));
  }

  const refreshDataFromServer = () => {
    refreshDataAndMappings();
  };

  // แก้ไขฟังก์ชัน handlePostScores เพื่อตรวจสอบว่าอยู่ที่แท็บไหน
  const handlePostScores = () => {
    // ตรวจสอบว่าตอนนี้อยู่ที่แท็บไหนอย่างชัดเจน
    if (activeTab === 3) {
      // ถ้าอยู่ที่แท็บ CLO-PLO Mapping (แท็บ 3)
      // ส่งข้อมูลไปยังตาราง plo_clo
      handlePostPloCloScores();
    } else if (activeTab === 2) {
      // ถ้าอยู่ที่แท็บ Course-CLO Mapping (แท็บ 2)
      // ส่งข้อมูลไปยังตาราง course_clo
      handlePostCourseCloScores();
    }
  };

  const handlePostPloCloScores = () => {
    // ตรวจสอบว่าอยู่ในแท็บ CLO-PLO Mapping
    if (activeTab !== 3) {
      console.error("ฟังก์ชันนี้ควรถูกเรียกจากแท็บ CLO-PLO Mapping เท่านั้น");
      return;
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    if (
      !selectedProgram ||
      !selectedSemesterId ||
      !selectedYear ||
      !selectedCourseId
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // ตรวจสอบว่ามีข้อมูล scores หรือไม่
    if (Object.keys(scores).length === 0) {
      alert("ไม่มีคะแนนที่จะส่ง กรุณาใส่คะแนนก่อน");
      return;
    }

    // สร้าง array ploCloData สำหรับเก็บข้อมูลที่จะส่งไปยัง API
    const ploCloData = [];

    // สร้างข้อมูล plo_clo จาก scores
    for (const key in scores) {
      if (scores[key] > 0) {
        // แยกค่า PLO_id และ CLO_id จาก key
        const parts = key.split("-");

        // ตรวจสอบว่ามีการแบ่งอย่างถูกต้อง
        if (parts.length !== 2) {
          console.error(`พบ key ที่ไม่ถูกต้อง: ${key}`);
          continue;
        }

        const ploId = parseInt(parts[0], 10);
        const cloId = parseInt(parts[1], 10);

        // ตรวจสอบความถูกต้องของ PLO_id
        if (isNaN(ploId)) {
          console.error(`พบค่า PLO_id ที่ไม่ถูกต้อง: ${ploId}`);
          continue;
        }

        // เพิ่มข้อมูลที่จะส่ง
        ploCloData.push({
          PLO_id: ploId,
          CLO_id: cloId,
          course_id: parseInt(selectedCourseId, 10),
          section_id: 1, // Default section เป็น 1 เนื่องจากไม่คำนึงถึง section
          semester_id: parseInt(selectedSemesterId, 10),
          year: parseInt(selectedYear, 10),
          weight: parseInt(scores[key], 10) || 0,
        });
      }
    }

    // ตรวจสอบว่ามีข้อมูลที่จะส่งหรือไม่
    if (ploCloData.length === 0) {
      alert(
        "ไม่มีคะแนนที่จะส่ง หรือข้อมูลมีรูปแบบไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง"
      );
      return;
    }

    // แสดง loading spinner
    setLoading(true);

    // สร้าง payload ในรูปแบบที่ server ต้องการ
    const payload = {
      scores: ploCloData,
    };

    // ส่งข้อมูลไป API
    axios
      .post("/plo_clo", payload)
      .then((response) => {
        if (response.data && response.data.success) {
          // แสดงข้อความสำเร็จ
          alert("บันทึกการเชื่อมโยง PLO-CLO สำเร็จ!");

          // ออกจากโหมดแก้ไข
          setEditingScores(false);

          // เรียกใช้ฟังก์ชัน fetchPLOCLOMappings เพื่อรีเฟรชข้อมูล
          fetchPLOCLOMappings();
        } else {
          alert(response.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล PLO-CLO:", error);
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
        setLoading(false);
      });
  };

  const handlePostCourseCloScores = () => {
    // ตรวจสอบว่าตอนนี้อยู่ที่แท็บ Course-CLO Mapping จริงๆ
    if (activeTab !== 2) {
      console.error(
        "ฟังก์ชันนี้ควรถูกเรียกจากแท็บ Course-CLO Mapping เท่านั้น"
      );
      return;
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    if (
      !selectedProgram ||
      !selectedSemesterId ||
      !selectedYear ||
      !selectedCourseId
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // ตรวจสอบว่ามีข้อมูล weightEachCourse หรือไม่
    if (!weightEachCourse || Object.keys(weightEachCourse).length === 0) {
      alert("ไม่พบข้อมูลน้ำหนัก CLO กรุณาตรวจสอบข้อมูลหรือโหลดข้อมูลใหม่");
      return;
    }

    // สร้าง array courseCloData สำหรับเก็บข้อมูลที่จะส่งไปยัง API
    const courseCloData = [];

    // สร้างข้อมูล course_clo จาก weightEachCourse
    // ค้นหา key ที่เริ่มต้นด้วย "a" + selectedCourseId
    const keyPrefix = `a${selectedCourseId}_`;

    Object.entries(weightEachCourse).forEach(([key, value]) => {
      // ตรวจสอบว่า key เป็นของ course ที่เลือกหรือไม่
      if (key.startsWith(keyPrefix)) {
        // ดึง clo_id จาก key หรือจากค่า value โดยตรง
        const cloId = value.clo_id;

        if (cloId) {
          // เพิ่มข้อมูลเฉพาะที่จำเป็น - เน้นเรื่องการอัพเดทค่า weight
          courseCloData.push({
            course_id: parseInt(selectedCourseId, 10),
            clo_id: parseInt(cloId, 10),
            section_id: parseInt(selectedSectionId, 10),
            semester_id: parseInt(selectedSemesterId, 10),
            year: parseInt(selectedYear, 10),
            weight: parseInt(value.weight, 10) || 0,
          });
        }
      }
    });

    // ตรวจสอบว่ามีข้อมูลที่จะส่งหรือไม่
    if (courseCloData.length === 0) {
      alert("ไม่มีน้ำหนัก CLO ที่จะส่ง กรุณาตรวจสอบข้อมูล");
      return;
    }

    // แสดง loading spinner
    setLoading(true);

    // สร้าง payload ในรูปแบบที่ server ต้องการ - เน้นการอัพเดทเท่านั้น
    const payload = {
      program_id: parseInt(selectedProgram, 10),
      semester_id: parseInt(selectedSemesterId, 10),
      section_id: parseInt(selectedSectionId, 10),
      year: parseInt(selectedYear, 10),
      scores: courseCloData,
    };
    // ใช้ PATCH method เพื่อทำการอัพเดทเท่านั้น
    axios
      .patch("/course_clo/weight", payload)
      .then((response) => {
        if (response.data && response.data.success) {
          // อัปเดตสถานะ
          alert("บันทึกการเชื่อมโยง Course-CLO สำเร็จ!");
          setEditingScores(false); // ออกจากโหมดแก้ไข
          refreshDataFromServer();
        } else {
          alert(response.data?.message || "เกิดข้อผิดพลาด");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error);

        // แสดงรายละเอียดข้อผิดพลาด
        let errorMsg = `เกิดข้อผิดพลาด: ${error.message}`;
        if (error.response && error.response.data) {
          errorMsg += `\nรายละเอียด: ${JSON.stringify(error.response.data)}`;
        }
        alert(errorMsg);
        setLoading(false);
      });
  };

  const refreshDataAndMappings = async () => {
    // 1. ดึงข้อมูล CLO ใหม่
    try {
      if (
        selectedProgram &&
        selectedCourseId &&
        selectedSectionId &&
        selectedSemesterId &&
        selectedYear
      ) {
        const response = await axios.get("/api/course-clo/filter", {
          params: {
            program_id: selectedProgram,
            course_id: selectedCourseId,
            semester_id: selectedSemesterId,
            section_id: selectedSectionId,
            year: selectedYear,
          },
        });
        setCLOs(response.data);

        await fetchPLOCLOMappings();

        if (selectedProgram) {
          await fetchCourseWeights(selectedProgram);
        }
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการรีเฟรชข้อมูล:", error);
    }
  };

  // แก้ไขฟังก์ชัน handlePatchScores เพื่อตรวจสอบว่าอยู่ที่แท็บไหน
  const handlePatchScores = () => {
    // ตรวจสอบว่าตอนนี้อยู่ที่แท็บไหนอย่างชัดเจน
    if (activeTab === 3) {
      // ถ้าอยู่ที่แท็บ CLO-PLO Mapping (แท็บ 3)
      // ส่งข้อมูลไปยังตาราง plo_clo
      handlePatchPloCloScores();
    } else if (activeTab === 2) {
      // ถ้าอยู่ที่แท็บ Course-CLO Mapping (แท็บ 2)
      // ส่งข้อมูลไปยังตาราง course_clo
      handlePatchCourseCloScores();
    }
  };

  // เพิ่มฟังก์ชันใหม่สำหรับอัพเดทข้อมูลในตาราง plo_clo
  const handlePatchPloCloScores = () => {
    // ตรวจสอบว่ามี scores ที่ต้องการอัพเดตหรือไม่
    if (Object.keys(scores).length === 0) {
      alert("ไม่มีการเปลี่ยนแปลงคะแนน กรุณาแก้ไขคะแนนก่อน");
      return;
    }

    // สร้าง array ploCloData สำหรับเก็บข้อมูลที่จะส่งไปยัง API
    const ploCloData = [];

    // สร้างข้อมูล plo_clo จาก scores
    for (const key in scores) {
      if (scores[key] > 0) {
        // แยกค่า PLO_id และ CLO_id จาก key
        const [ploId, cloId] = key.split("-");

        // เพิ่มข้อมูลที่จะส่ง
        ploCloData.push({
          PLO_id: parseInt(ploId, 10),
          CLO_id: parseInt(cloId, 10),
          course_id: parseInt(selectedCourseId, 10),
          section_id: 1, // Default section เป็น 1 เนื่องจากไม่คำนึงถึง section
          semester_id: parseInt(selectedSemesterId, 10),
          year: parseInt(selectedYear, 10),
          weight: parseInt(scores[key], 10) || 0,
        });
      }
    }

    // แสดง loading spinner
    setLoading(true);

    // สร้าง payload ในรูปแบบที่ server ต้องการ
    const ploCloPayload = { mappings: ploCloData };

    // ส่งข้อมูลไป API
    axios
      .patch("/plo_clo", ploCloPayload)
      .then((response) => {
        if (response.data && response.data.success) {
          alert("อัพเดตการเชื่อมโยง PLO-CLO สำเร็จ!");
          setEditingScores(false);

          // เรียกใช้ฟังก์ชัน fetchPLOCLOMappings เพื่อรีเฟรชข้อมูล
          fetchPLOCLOMappings();
        } else {
          alert(response.data?.message || "เกิดข้อผิดพลาด");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการอัพเดตข้อมูล:", error);
        let errorMsg = `เกิดข้อผิดพลาด: ${error.message}`;
        if (error.response && error.response.data) {
          errorMsg += `\nรายละเอียด: ${JSON.stringify(error.response.data)}`;
        }
        alert(errorMsg);
        setLoading(false);
      });
  };
  // เปลี่ยนชื่อฟังก์ชันเดิมเป็น handlePatchCourseCloScores
  const handlePatchCourseCloScores = () => {
    if (Object.keys(scores).length === 0) {
      alert("ไม่มีการเปลี่ยนแปลงคะแนน กรุณาแก้ไขคะแนนก่อน");
      return;
    }

    // เตรียมข้อมูล plo_clo
    const ploCloData = [];

    // เตรียมข้อมูล course_clo
    const courseCloData = [];

    // วนลูปสร้างข้อมูลทั้งสองส่วน
    for (const key in scores) {
      if (scores[key] > 0) {
        const [ploId, cloId] = key.split("-");

        // เพิ่มข้อมูล plo_clo
        ploCloData.push({
          clo_id: parseInt(cloId, 10),
          plo_id: parseInt(ploId, 10),
          program_id: parseInt(selectedProgram, 10),
          course_id: parseInt(selectedCourseId, 10), // เพิ่ม parameter ที่จำเป็น
          section_id: parseInt(selectedSectionId, 10), // เพิ่ม parameter ที่จำเป็น
          semester_id: parseInt(selectedSemesterId, 10), // เพิ่ม parameter ที่จำเป็น
          year: parseInt(selectedYear, 10), // เพิ่ม parameter ที่จำเป็น
          weight: 100, // CLO → PLO ใช้น้ำหนัก 100 เสมอ
        });

        // เพิ่มข้อมูล course_clo
        courseCloData.push({
          program_id: parseInt(selectedProgram, 10), // เพิ่ม program_id
          course_id: parseInt(selectedCourseId, 10),
          clo_id: parseInt(cloId, 10),
          section_id: parseInt(selectedSectionId, 10),
          semester_id: parseInt(selectedSemesterId, 10),
          year: parseInt(selectedYear, 10),
          weight: parseInt(scores[key], 10) || 0,
        });
      }
    }

    // แสดง loading spinner
    setLoading(true);

    // ข้อมูลที่จะส่งอาจต้องการการห่อด้วย object
    const ploCloPayload = { mappings: ploCloData };
    const courseCloPayload = { mappings: courseCloData };

    // ส่งข้อมูล plo_clo ก่อน
    axios
      .patch("/api/plo_clo", ploCloPayload)
      .then(() => {
        // หลังจากปรับปรุง plo_clo สำเร็จ ให้ปรับปรุง course_clo ต่อ
        return axios.patch("/course_clo", courseCloPayload);
      })
      .then((response) => {
        if (response.data && response.data.success) {
          alert("อัปเดตคะแนนสำเร็จ!");
          setEditingScores(false);
          refreshDataFromServer();
        } else {
          alert(response.data?.message || "เกิดข้อผิดพลาด");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการอัปเดตคะแนน:", error);
        let errorMsg = `เกิดข้อผิดพลาด: ${error.message}`;
        if (error.response && error.response.data) {
          errorMsg += `\nรายละเอียด: ${JSON.stringify(error.response.data)}`;
        }
        alert(errorMsg);
        setLoading(false);
      });
  };

  // แก้ไขฟังก์ชัน handleSavePloCloMappings
  const handleSavePloCloMappings = () => {
    // จากส่วน scores หรือตัวแปรที่เก็บการเลือก PLO
    // สร้างข้อมูลการเชื่อมโยง PLO-CLO
    const ploCloData = [];

    // ถ้าอยู่ในโหมดแก้ไข ให้ใช้ข้อมูลจาก scores
    if (editingScores) {
      Object.entries(scores).forEach(([key, value]) => {
        if (value > 0) {
          const [ploId, cloId] = key.split("-");

          ploCloData.push({
            clo_id: parseInt(cloId, 10),
            plo_id: parseInt(ploId, 10),
            program_id: parseInt(selectedProgram, 10),
            course_id: parseInt(selectedCourseId, 10),
            section_id: parseInt(selectedSectionId, 10),
            semester_id: parseInt(selectedSemesterId, 10),
            year: parseInt(selectedYear, 10),
            weight: parseInt(value, 10) || 100,
          });
        }
      });
    } else {
      // ถ้าไม่อยู่ในโหมดแก้ไข ให้ใช้ข้อมูลจาก mappings ที่มีอยู่
      mappings.forEach((mapping) => {
        if (mapping.PLO_id && mapping.weight > 0) {
          ploCloData.push({
            clo_id: parseInt(mapping.CLO_id, 10),
            plo_id: parseInt(mapping.PLO_id, 10),
            program_id: parseInt(selectedProgram, 10),
            course_id: parseInt(selectedCourseId, 10),
            section_id: parseInt(selectedSectionId, 10),
            semester_id: parseInt(selectedSemesterId, 10),
            year: parseInt(selectedYear, 10),
            weight: parseInt(mapping.weight, 10) || 100,
          });
        }
      });
    }

    // ส่งข้อมูลไปยัง API
    axios
      .post("/plo_clo", { mappings: ploCloData })
      .then((response) => {
        alert("บันทึกการเชื่อมโยง PLO-CLO สำเร็จ!");

        // ออกจากโหมดแก้ไข
        setEditingScores(false);

        // รีเฟรชข้อมูล
        refreshDataFromServer();
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการบันทึก PLO-CLO:", error);
        alert("เกิดข้อผิดพลาดในการบันทึก: " + error.message);
      });
  };

  // ฟังก์ชันเพิ่มรายวิชา
  const addCourse = async () => {
    try {
      const response = await axios.post("/api/program-course", {
        program_id: newCourse.program_id,
        course_id: newCourse.course_id,
        course_name: newCourse.course_name, // Send course_name data
        course_engname: newCourse.course_engname, // Send course_engname data
        semester_id: newCourse.semester_id,
        year: newCourse.year,
        section_id: newCourse.section,
      });
      alert("Course added successfully!");
    } catch (err) {
      console.error("Error adding course:", err);
    }
    fetchAllCourseByProgram(selectedProgram);
  };


  async function fetchSelectCourse() {
    try {
      const response = await axios.get(`/api/program-course/detail`, {
        params: {
          program_id: selectedProgram,
          year: selectedYear,
          semester_id: selectedSemesterId,
        },
      });
      setCourses(response.data);
      setSelectedCourseId();
    } catch (error) {
      setCourses([]);
      console.error(error);
    }
  }

  // ฟังก์ชันอัพเดตรายวิชา
  const updateCourse = async (updatedCourse) => {
    try {
      const response = await axios.put(
        `/program_course/${updatedCourse.course_id}`,
        {
          new_course_id: updatedCourse.new_course_id,
          course_name: updatedCourse.course_name,
          course_engname: updatedCourse.course_engname,
          program_id: updatedCourse.program_id,
          semester_id: updatedCourse.semester_id,
        }
      );

      // Refetch courses to ensure complete sync with backend
      if (newCourse.program_id && newCourse.semester_id) {
        fetchCourses();
      }

      setEditCourse({
        course_id: "",
        new_course_id: "",
        course_name: "",
        course_engname: "",
        program_id: "",
      });

      alert("Course updated successfully!");
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Failed to update course. Please try again.");
    }
  };

  // ฟังก์ชันลบรายวิชา
  const deleteCourse = async (courseId, sectionId) => {
    try {
      const response = await axios.delete("/api/program-course", {
        params: {
          program_id: newCourse.program_id, // Selected program
          semester_id: newCourse.semester_id, // Selected semester
          course_id: courseId,
          section_id: sectionId,
        },
      });
      alert("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
    }

    fetchAllCourseByProgram(selectedProgram);
  };

  // ฟังก์ชันแก้ไขรายวิชา
  const handleEditCourse = (courseItem) => {
    setEditCourse({
      course_id: courseItem.course_id,
      course_name: courseItem.course_name,
      course_engname: courseItem.course_engname,
      program_id: courseItem.program_id,
      year: courseItem.year,
      section: courseItem.section,
      semester_id: courseItem.semester_id,
    });
  };

  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case "university":
        setSelectedUniversity(value);

        // รีเซ็ตค่าที่เกี่ยวข้องทั้งหมด
        setSelectedFaculty("");
        setSelectedProgram("");
        setSelectedYear("");
        setNewCourse((prev) => ({
          ...prev,
          semester_id: "",
        }));

        // รีเซ็ตข้อมูลการแสดงผล
        setCourse([]);
        setClos([]);
        setWeights({});
        setScores({});
        setShowMapping(false);

        // รีเซ็ตตัวเลือก Course และ Section สำหรับหน้า CLO
        setSelectedCourseId("");
        setSelectedSectionId("");
        setSelectedSemesterId("");
        break;

      case "faculty":
        setSelectedFaculty(value);

        // รีเซ็ตค่าที่เกี่ยวข้อง
        setSelectedProgram("");
        setSelectedYear("");
        setNewCourse((prev) => ({
          ...prev,
          semester_id: "",
        }));

        // รีเซ็ตข้อมูลการแสดงผล
        setCourse([]);
        setClos([]);
        setWeights({});
        setScores({});
        setShowMapping(false);

        // รีเซ็ตตัวเลือก Course และ Section สำหรับหน้า CLO
        setSelectedCourseId("");
        setSelectedSectionId("");
        setSelectedSemesterId("");
        break;

      case "program":
        setSelectedProgram(value);

        // รีเซ็ตค่าปีและภาคเรียน แต่ไม่ disable Year
        setSelectedYear("");
        setNewCourse((prev) => ({
          ...prev,
          semester_id: "",
        }));

        // รีเซ็ตข้อมูลการแสดงผล
        setCourse([]);
        setClos([]);
        setWeights({});
        setScores({});
        setShowMapping(false);

        // รีเซ็ตตัวเลือก Course และ Section สำหรับหน้า CLO
        setSelectedCourseId("");
        setSelectedSectionId("");
        setSelectedSemesterId("");
        break;

      case "year":
        setSelectedYear(value);

        // อัพเดทค่าในตัวแปร newCourse
        setNewCourse((prev) => ({
          ...prev,
          year: value,
          semester_id: "", // รีเซ็ตภาคเรียน เมื่อเปลี่ยนปี
        }));

        // รีเซ็ตข้อมูลการแสดงผล
        setCourse([]);
        setClos([]);
        setWeights({});
        setScores({});
        setShowMapping(false);

        // รีเซ็ตตัวเลือก Course และ Section สำหรับหน้า CLO
        setSelectedCourseId("");
        setSelectedSectionId("");
        setSelectedSemesterId("");
        break;
    }
  };

  // ฟังก์ชันสลับโหมดแก้ไข
  const handleEditToggle = () => {
    setEditingScores(!editingScores);
  };

  // ฟังก์ชันคำนวณผลรวม
  const calculateTotal = (courseId) => {
    // Return 0 if no CLO data
    if (!clos || clos.length === 0) return 0;

    return clos.reduce((sum, clo) => {
      const key = `${courseId}-${clo.CLO_id}`;
      if (editingScores) {
        return sum + (parseFloat(scores[key]) || 0); // Use scores in edit mode
      } else {
        return sum + (parseFloat(weights[key]) || 0); // Use weights otherwise
      }
    }, 0);
  };

  const calculateTotalForPLO = (ploId) => {
    // console.log(`กำลังคำนวณค่ารวมสำหรับ PLO_id: ${ploId}`);

    if (!ploId) return 0;

    let total = 0;

    if (editingScores) {
      // ใช้ scores ในโหมดแก้ไข
      CLOs.forEach((clo) => {
        const key = `${ploId}-${clo.CLO_id}`;
        const value = Number(scores[key] || 0);
        // console.log(`  key=${key}, value=${value}`);
        total += value;
      });
    } else {
      // ใช้ข้อมูลจาก mappings ที่มีอยู่
      const ploMappings = mappings.filter(
        (m) => m.PLO_id === ploId || m.plo_id === ploId
      );

      // console.log(`  พบ ${ploMappings.length} mappings สำหรับ PLO_id: ${ploId}`);

      total = ploMappings.reduce((sum, mapping) => {
        const value = Number(mapping.weight || 0);
        return sum + value;
      }, 0);
    }

    // console.log(`  ผลรวม = ${total}`);
    return total || 0;
  };

  const saveEditAssignment = async () => {
    try {
      setSaving(true);

      // ตรวจสอบข้อมูลที่จำเป็น
      const requiredFields = [
        "assignment_name",
        "course_name",
        "section_id",
        "semester_id",
        "year",
      ];
      const missingFields = requiredFields.filter((field) => !editData[field]);

      if (missingFields.length > 0) {
        showAlert(
          `กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.join(", ")}`,
          "error"
        );
        setSaving(false);
        return;
      }

      // เตรียมข้อมูลสำหรับส่งไป API
      const updateData = {
        program_id: parseInt(editData.program_id) || assignment.program_id,
        course_name: editData.course_name,
        section_id: parseInt(editData.section_id),
        semester_id: parseInt(editData.semester_id),
        year: parseInt(editData.year),
        assignment_name: editData.assignment_name,
        faculty_id: parseInt(editData.faculty_id) || assignment.faculty_id,
        university_id:
          parseInt(editData.university_id) || assignment.university_id,
      };

      // เรียกใช้ API สำหรับอัปเดตข้อมูล
      const response = await axios.put(
        `/api/update_assignment/${currentAssignmentId}`,
        updateData
      );

      if (response.data) {
        // อัปเดตข้อมูลใน state
        setAssignment((prev) => ({
          ...prev,
          ...updateData,
        }));

        // ปิดโหมดแก้ไข
        setIsEditing(false);
        showAlert("บันทึกการแก้ไขข้อมูล Assignment เรียบร้อยแล้ว", "success");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกการแก้ไข:", error);
      const errorDetail = error.response?.data?.error || error.message;
      console.error("รายละเอียดข้อผิดพลาด:", errorDetail);
      showAlert("เกิดข้อผิดพลาดในการบันทึกการแก้ไข: " + errorDetail, "error");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    // รีเซ็ตข้อมูลการแก้ไขเป็นค่าเดิม
    setEditData({
      assignment_name: assignment.assignment_name || "",
      course_name: assignment.course_name || "",
      section_id: assignment.section_id || "",
      semester_id: assignment.semester_id || "",
      year: assignment.year || "",
      program_id: assignment.program_id || "",
      faculty_id: assignment.faculty_id || "",
      university_id: assignment.university_id || "",
    });

    // ปิดโหมดแก้ไข
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Improved fetchPLOCLOMappings function
  const fetchPLOCLOMappings = async () => {
    try {
      if (
        !selectedProgram ||
        !selectedCourseId ||
        !selectedSemesterId ||
        !selectedYear
      ) {
        console.log("Missing required parameters for fetchPLOCLOMappings");
        return;
      }

      // Show loading indicator if needed
      // setLoading(true);

      // Use the new endpoint to fetch PLO-CLO mappings
      const response = await axios.get("/api/plo-clo-mapping", {
        params: {
          program_id: selectedProgram,
          course_id: selectedCourseId,
          semester_id: selectedSemesterId,
          year: selectedYear,
        },
      });

      // Check if response has data
      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        // Set mappings with the returned data
        const formattedMappings = response.data.data;

        // Log for debugging
        console.log("Received mappings data:", formattedMappings);

        setMappings(formattedMappings);

        // Update weights from mappings
        const updatedWeights = {};
        formattedMappings.forEach((mapping) => {
          const ploId = mapping.PLO_id;
          const cloId = mapping.CLO_id;

          if (ploId && cloId) {
            const key = `${ploId}-${cloId}`;
            updatedWeights[key] = mapping.weight || 0;
          }
        });

        setWeights(updatedWeights);

        // If in editing mode, update scores as well
        if (editingScores) {
          setScores({ ...updatedWeights });
        }

        console.log(
          "PLO-CLO mappings fetched successfully:",
          formattedMappings.length
        );
      } else {
        console.warn("No data returned from API or request was not successful");
        setMappings([]);
        setWeights({});
      }
    } catch (error) {
      console.error("Error fetching PLO-CLO mappings:", error);
      setMappings([]);
      setWeights({});
    } finally {
      // Hide loading indicator if needed
      // setLoading(false);
    }
  };

  const updateWeightsFromMappings = (mappingData) => {
    const updatedWeights = {};

    mappingData.forEach((mapping) => {
      // ใช้ PLO_id หรือ plo_id ตามที่มีในข้อมูล
      const ploId = mapping.PLO_id || mapping.plo_id;
      const cloId = mapping.CLO_id || mapping.clo_id;

      if (ploId && cloId) {
        const key = `${ploId}-${cloId}`;
        updatedWeights[key] = mapping.weight || 0;
      } else {
        console.error("ไม่พบ PLO_id หรือ CLO_id ในข้อมูล mapping:", mapping);
      }
    });
    setWeights(updatedWeights);

    // อัพเดต scores ด้วยถ้าอยู่ในโหมดแก้ไข
    if (editingScores) {
      setScores(updatedWeights);
    }
  };

  async function fetchAllCourseByProgram(programId) {
    if (!programId) return;
    try {
      const response = await axios.get(`/api/program-course/detail`, {
        params: {
          program_id: selectedProgram,
          year: selectedYear,
          semester_id: selectedSemesterId,
        },
      });
      setCourseList(response.data);
    } catch (error) {
      console.error("Error fetching program courses:", error);
      setCourseList([]);
      setProgramCourseData({
        courses: [],
        sections: [],
        semesters: [],
        years: [],
      });
    }
  }

  const handleSaveEditAssignment = async () => {
    if (
      !selectedProgram ||
      !selectedCourseId ||
      !selectedSectionId ||
      !selectedSemesterId ||
      !selectedYear ||
      !assignmentName ||
      !currentAssignmentId
    ) {
      setTypeError("กรุณากรอกข้อมูลทั้งหมดก่อนบันทึก");
      return;
    }

    // Get the course name from the selected course ID
    const selectedCourseObj = programCourseData.courses.find(
      (c) => c.course_id.toString() === selectedCourseId.toString()
    );

    // If no course is found, show error
    if (!selectedCourseObj) {
      setTypeError("ไม่พบข้อมูลรายวิชาที่เลือก");
      return;
    }

    // แสดงสถานะกำลังบันทึก
    setLoading(true);

    try {
      // Construct the payload for updating assignment
      const updateData = {
        program_id: parseInt(selectedProgram, 10),
        course_name: selectedCourseObj.course_name,
        section_id: parseInt(selectedSectionId, 10),
        semester_id: parseInt(selectedSemesterId, 10),
        year: parseInt(selectedYear, 10),
        assignment_name: assignmentName,
        faculty_id: parseInt(selectedFaculty, 10),
        university_id: parseInt(selectedUniversity, 10),
      };

      // Call the API to update the assignment
      const response = await axios.put(
        `/api/update_assignment/${currentAssignmentId}`,
        updateData
      );
      if (response.data) {
        // แสดงข้อความสำเร็จ
        alert("บันทึกการแก้ไขข้อมูล Assignment สำเร็จ!");

        // ปิดโหมดแก้ไข
        setIsEditing(false);

        // เมื่อแก้ไขสำเร็จ ให้ไปยังขั้นตอนที่ 2
        setCurrentStep(2);

        // เตรียมข้อมูล homeworks
        if (currentAssignmentId) {
          // ใช้ข้อมูล Assignment ที่แก้ไขแล้ว
          const newHomework = {
            id: currentAssignmentId,
            name: assignmentName,
            scores: {},
          };

          // ถ้ามีข้อมูล CLO ให้เตรียมข้อมูลคะแนน
          if (CLOs && CLOs.length > 0) {
            CLOs.forEach((clo) => {
              newHomework.scores[clo.CLO_id || clo.clo_id] = 0;
            });
          }

          setHomeworks([newHomework]);
        }
      } else {
        // แสดงข้อความผิดพลาด
        alert(response.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Error updating Assignment:", error);

      // แสดงข้อความผิดพลาด
      alert(`เกิดข้อผิดพลาด: ${error.message || "ไม่สามารถบันทึกข้อมูลได้"}`);
    } finally {
      // ปิดสถานะกำลังบันทึก
      setLoading(false);
    }
  };

  // Part 3: Ensure the scores state is properly initialized when entering edit mode
  // Add this to the handleEditToggle function
  const handleEditToggle2 = () => {
    // Toggle editing mode
    const newEditingState = !editingScores;
    setEditingScores(newEditingState);

    // If entering edit mode, initialize scores based on existing mappings
    if (newEditingState) {
      const initialScores = {};
      mappings.forEach((mapping) => {
        const ploId = mapping.PLO_id || mapping.plo_id;
        const cloId = mapping.CLO_id || mapping.clo_id;

        if (ploId && cloId) {
          const key = `${ploId}-${cloId}`; // Define the key
          initialScores[key] = mapping.weight || 0;
        }
      });
      setScores(initialScores);
    }
  };

  // ฟังก์ชันจัดการวางข้อมูลโดยตรง
  const handleDirectPaste = (e) => {
    e.preventDefault();

    // รับข้อมูลจาก clipboard event
    const clipboardData = e.clipboardData || window.clipboardData;
    const text = clipboardData.getData("text");

    if (!text || text.trim() === "") {
      return;
    }

    // แยกข้อมูลตามบรรทัด
    const rows = text.trim().split(/\r?\n/);

    // ตรวจสอบว่ามีการใช้ tab หรือ comma เป็นตัวคั่น
    let delimiter = "\t"; // ค่าเริ่มต้นคือ tab
    if (rows[0].includes(",") && !rows[0].includes("\t")) {
      delimiter = ",";
    }

    // แปลงข้อมูลเป็น array ของ objects
    const parsedData = rows.map((row) => {
      const columns = row.split(delimiter);
      return {
        CLO_code: columns[0] || "",
        CLO_name: columns[1] || "",
        CLO_engname: columns[2] || "",
      };
    });

    // อัปเดต excelData state
    setExcelData(parsedData);

    // ปิดพื้นที่วางข้อมูล
    setShowPasteArea(false);
  };

  // อัปโหลด clo file
  const handleFileUpload = async (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    setExcelData([]);
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Find the selected program
            const programData = programs.find(
              (program) =>
                program.program_id.toString() === selectedProgram.toString()
            );

            if (!programData) {
              console.error("Selected program not found:", selectedProgram);
              alert(
                "Error: Selected program not found. Please select a valid program."
              );
              return;
            }

            // Ensure all required fields are present
            const updatedData = jsonData.map((row) => ({
              CLO_code: row.CLO_code || "DEFAULT_CODE", // ให้ค่าเริ่มต้นแทนค่าว่าง
              CLO_name: row.CLO_name || "DEFAULT_NAME", // ให้ค่าเริ่มต้นแทนค่าว่าง
              CLO_engname: row.CLO_engname || "DEFAULT_ENG_NAME", // ให้ค่าเริ่มต้นแทนค่าว่าง
            }));

            // Validate that all required fields are present in each row
            const invalidRows = updatedData.filter((row) => !row.CLO_code);

            if (invalidRows.length > 0) {
              console.error("Invalid rows found:", invalidRows);
              alert(
                `Error: ${invalidRows.length} rows are missing required fields. Please check your Excel data.`
              );
              return;
            }

            setExcelData(updatedData); // อัปเดตข้อมูลใน State
            setShowPreviewModal(true);
          } catch (error) {
            console.error("Error reading file:", error);
            alert("Error processing file: " + error.message);
          }
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          alert("Error reading file: " + error.message);
        };
        reader.readAsArrayBuffer(selectedFile);
      } else {
        setTypeError("Please select only Excel file types");
        alert("Please select only Excel file types");
      }
    }
  };

  //ฟังก์ชัน ตรวจข้อมูลซ้ำ
  const existingCloMap = new Set(
    CLOs.map(clo =>
      `${clo.CLO_code?.trim().toLowerCase()}|${clo.CLO_name?.trim().toLowerCase()}|${clo.CLO_engname?.trim().toLowerCase()}`
    )
  );



  async function fetchFilteredCourseClo() {
    setSelectedCourseClo([]);
    try {
      const response = await axios.get(`/api/clo/course`, {
        params: { course_id: selectedCourseId, year: selectedYear },
      });
      setSelectedCourseClo(response.data.data);
    } catch (error) {
      console.error("Error refreshing CLOs: ", error);
    }
  }

  // ฟังก์ชันอัพโหลดข้อมูล
  const handleUploadPrevious = async () => {
    if (!previousYearCLOs || previousYearCLOs.length === 0) {
      console.error("No data to upload");
      alert("No data to upload. Please paste or upload data first.");
      return;
    }

    // Additional validation before sending to server
    if (
      !selectedProgram ||
      !selectedCourseId ||
      !selectedSemesterId ||
      !selectedYear
    ) {
      alert(
        "Please select Program, Course, Section, Semester, and Year before uploading."
      );
      return;
    }

    // Check each row for required fields
    const missingFields = previousYearCLOs.some(
      (row) => !row.CLO_code || !row.CLO_name || !row.CLO_engname
    );

    if (missingFields) {
      alert("Some rows are missing required fields. Please check your data.");
      return;
    }

    let payload = [];
    for (let i = 0; i < previousYearCLOs.length; i++) {
      payload.push({
        ...previousYearCLOs[i],
        year: previousYearCLOs[i].year + 1,
      });
    }

    try {
      const response = await axios.post("/api/clo-mapping/excel", payload);
      if (
        selectedCourseId &&
        selectedSemesterId &&
        selectedYear &&
        selectedProgram
      ) {
        fetchFilteredCourseClo();
      }
      setShowPreviousYearCLOsModal(false);
    } catch (error) {
      console.error("Error : ", error);
      alert("An error occurred: " + error.message);
    }
  };

  const handleUploadButtonClick = async () => {
    if (!excelData || excelData.length === 0) {
      console.error("No data to upload");
      alert("No data to upload. Please paste or upload data first.");
      return;
    }

    // Additional validation before sending to server
    if (!selectedCourseId || !selectedYear) {
      alert(
        "Please select Program, Course, Section, Semester, and Year before uploading."
      );
      return;
    }

    const missingFields = excelData.some(
      (row) => !row.CLO_code || !row.CLO_name || !row.CLO_engname
    );

    if (missingFields) {
      alert("Some rows are missing required fields. Please check your data.");
      return;
    }
    try {
      const response = await axios.post(`/api/clo/upload`, excelData, {
        params: { course_id: selectedCourseId, year: selectedYear },
      });
      alert(response.data.message);
      setShowPreviewModal(false);
      setExcelData(null);
      fetchFilteredCourseClo();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddClo = async () => {
    if (!selectedCourseId) {
      alert("Please select a course.");
      return;
    }

    if (!selectedYear) {
      alert("Please select a course.");
      return;
    }

    if (!editCloCode) {
      alert("Please enter a CLO code.");
      return;
    }

    if (!editCloName) {
      alert("Please enter a CLO name.");
      return;
    }

    if (!editCloEngName) {
      alert("Please enter a CLO English name.");
      return;
    }

    // Prepare the data for submission
    const newClo = {
      course_id: parseInt(selectedCourseId),
      year: parseInt(selectedYear),
      clo_code: editCloCode.trim(),
      clo_name: editCloName.trim(),
      clo_engname: editCloEngName.trim(),
    };

    try {
      const response = await axios.post("/api/clo", newClo);
      setEditCloCode("");
      setEditCloName("");
      setEditCloEngName("");
      setShowAddModal(false);
      alert("CLO added successfully!");
      fetchFilteredCourseClo();
    } catch (error) {
      alert("An error occurred while adding the CLO");
    }
  };

  // ฟังก์ชันแก้ไข CLO
  const handleEditClo = (cloId) => {
    const cloToEdit = CLOs.find((clo) => clo.CLO_id === cloId);
    if (cloToEdit) {
      setEditClo(cloToEdit); // Set the CLO to edit
      setEditCloName(cloToEdit.CLO_name || ""); // Initialize CLO name
      setEditCloEngName(cloToEdit.CLO_engname || ""); // Initialize CLO English name
      setEditCloCode(cloToEdit.CLO_code || "");
      setShowEditModal(true); // Show the modal
    }
  };

  const saveScores = async () => {
    // เช็คว่ามีนักเรียนที่จะบันทึกคะแนนหรือไม่
    if (!importedStudents || importedStudents.length === 0) {
      alert("ไม่พบรายชื่อนักเรียนที่จะบันทึกคะแนน");
      return;
    }

    try {
      // แสดงสถานะกำลังบันทึก
      setSaving(true);

      // สร้างข้อมูลสำหรับส่งไป API
      const scoreData = [];

      // สร้างข้อมูลคะแนนสำหรับแต่ละนักเรียน
      importedStudents.forEach((student) => {
        // ดูว่ามีคะแนนของนักเรียนคนนี้หรือไม่
        const studentScores = scores[student.student_id] || {};

        // สำหรับแต่ละ CLO ในงานนี้
        CLOs.forEach((clo) => {
          // ดึงค่า assignment_clo_id จาก CLO
          const assignmentCloId = clo.assignment_clo_id;
          if (assignmentCloId) {
            // เพิ่มข้อมูลคะแนน
            scoreData.push({
              student_id: student.student_id,
              assignment_clo_id: assignmentCloId,
              score: studentScores[assignmentCloId] || 0,
            });
          }
        });
      });

      // ส่งข้อมูลไป API
      const response = await axios.post("/api/save_scores", {
        scores: scoreData,
      });

      if (response.data && response.data.success) {
        alert("บันทึกคะแนนเรียบร้อยแล้ว");
      } else {
        alert(response.data?.message || "เกิดข้อผิดพลาดในการบันทึกคะแนน");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกคะแนน:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // ดึงข้อมูลจาก sheet แรก
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // ตรวจสอบรูปแบบข้อมูล
        if (jsonData.length === 0) {
          alert("ไม่พบข้อมูลในไฟล์ Excel");
          return;
        }

        // ตรวจสอบว่ามีคอลัมน์ที่จำเป็นครบหรือไม่
        const requiredColumns = ["student_id", "name"];
        const firstRow = jsonData[0];
        const missingColumns = requiredColumns.filter(
          (col) => !(col in firstRow)
        );

        if (missingColumns.length > 0) {
          alert(
            `ไฟล์ Excel ไม่มีคอลัมน์ที่จำเป็น: ${missingColumns.join(", ")}`
          );
          return;
        }

        // แปลงข้อมูลและอัปเดต state
        const processedData = jsonData.map((row) => ({
          student_id: String(row.student_id),
          name: row.name,
        }));

        setImportedStudents(processedData);
        alert(`นำเข้าข้อมูลนักเรียน ${processedData.length} คนสำเร็จ`);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel:", error);
        alert(`เกิดข้อผิดพลาดในการอ่านไฟล์: ${error.message}`);
      }
    };

    reader.onerror = (error) => {
      console.error("เกิดข้อผิดพลาดในการอ่านไฟล์:", error);
      alert(`เกิดข้อผิดพลาดในการอ่านไฟล์: ${error.message}`);
    };

    reader.readAsArrayBuffer(file);
  };

  // เพิ่มฟังก์ชันสำหรับดาวน์โหลดเทมเพลต Excel
  const downloadExcelTemplate = () => {
    // สร้างเทมเพลตสำหรับใช้นำเข้าข้อมูลนักเรียน
    const template = [
      {
        student_id: "รหัสนักศึกษา",
        name: "ชื่อ-นามสกุล",
      },
    ];

    // สร้าง workbook และ worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);

    // เพิ่ม worksheet ลงใน workbook
    XLSX.utils.book_append_sheet(wb, ws, "นำเข้านักเรียน");

    // บันทึกไฟล์
    XLSX.writeFile(wb, "template_import_students.xlsx");
  };

  // ฟังก์ชันบันทึกการแก้ไข CLO
  const handleSaveClo = async () => {
    if (!editClo) return;

    // หา program_id จากโปรแกรมที่เลือก
    const selectedProgramData = programs.find(
      (program) => program.program_id.toString() === selectedProgram.toString()
    );

    if (!selectedProgramData) {
      console.error("Program not found:", selectedProgram);
      alert("Please select a valid program.");
      return;
    }

    // Validation checks
    if (!editCloCode) {
      alert("CLO Code cannot be empty.");
      return;
    }

    if (!editCloName) {
      alert("CLO Name cannot be empty.");
      return;
    }

    if (!editCloEngName) {
      alert("CLO English Name cannot be empty.");
      return;
    }

    const updatedCLO = {
      clo_id: editClo.CLO_id,
      program_id: selectedProgramData.program_id,
      course_id: selectedCourseId,
      semester_id: selectedSemesterId,
      section_id: selectedSectionId,
      year: selectedYear,
      CLO_name: editCloName.trim(),
      CLO_engname: editCloEngName.trim(),
      CLO_code: editCloCode.trim(), // เพิ่ม CLO_code ในการอัปเดต
    };

    try {
      const response = await axios.put("/course_clo", updatedCLO);

      if (response.data && response.data.success) {
        // Update the CLOs in the state with all fields
        const updatedCLOs = CLOs.map((clo) =>
          clo.CLO_id === editClo.CLO_id
            ? {
              ...clo,
              CLO_name: editCloName.trim(),
              CLO_engname: editCloEngName.trim(),
              CLO_code: editCloCode.trim(), // เพิ่ม CLO_code ในการอัปเดตที่แสดงในตาราง
            }
            : clo
        );

        setCLOs(updatedCLOs);

        // Close the modal
        setShowEditModal(false);

        // Optional: Show success message
        alert("CLO updated successfully!");
      } else {
        // Handle error response from server
        console.error("Failed to update CLO:", response.data);
        alert(
          `Failed to update CLO: ${response.data?.message || "Unknown error"}`
        );
      }
    } catch (err) {
      console.error("Error updating CLO:", err);
      alert("An error occurred while updating the CLO.");
    }
  };

  // ฟังก์ชันลบ CLO
  const handleDeleteClo = async (cloId, courseId, semesterId, year) => {
    if (!cloId || !courseId || !semesterId || !year) {
      console.error("Missing required fields");
      alert("Missing required fields. Please check your data.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this CLO?")) {
      try {
        // /api/course-clo/filter?course_id=3051234&semester_id=1&year=2024&clo_id=25
        const response = await axios.delete(
          `/api/course-clo/filter?course_id=${courseId}&semester_id=${semesterId}&year=${year}&clo_id=${cloId}`
        );
      } catch (error) {
        console.error("Error while deleting CLO:", error);
        alert("An error occurred while deleting the CLO.");
      }
      fetchFilteredCourseClo();
    }
  };

  const styles = {
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    assignmentInfo: {
      backgroundColor: "#f5f5f5",
      padding: "12px",
      borderRadius: "4px",
      marginBottom: "20px",
    },
    buttonContainer: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    editButton: {
      backgroundColor: "#ffc107",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    primaryButton: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    primaryButtonDisabled: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "4px",
      opacity: "0.65",
      cursor: "not-allowed",
    },
    secondaryButton: {
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    outlineButton: {
      backgroundColor: "transparent",
      color: "#007bff",
      border: "1px solid #007bff",
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    cancelButton: {
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    hidden: {
      display: "none",
    },
    editForm: {
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      marginBottom: "24px",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "8px 12px",
      borderRadius: "4px",
      border: "1px solid #ced4da",
      fontSize: "16px",
    },
  };
  // ฟังก์ชันดึงข้อมูล CLO ปีก่อนหน้า
  const fetchPreviousYearCLOs = async () => {
    if (
      !selectedProgram ||
      !selectedCourseId ||
      !selectedSemesterId ||
      !selectedYear
    ) {
      alert("กรุณาเลือกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const response = await axios.get("/api/course-clo/filter", {
        params: {
          program_id: selectedProgram,
          course_id: selectedCourseId,
          semester_id: selectedSemesterId,
          section_id: 1,
          year: selectedYear - 1,
        },
      });
      const formattedCLOs = Array.isArray(response.data)
        ? response.data
        : [response.data].filter(Boolean);

      if (formattedCLOs.length > 0) {
        setPreviousYearCLOs(formattedCLOs);
        setShowPreviousYearCLOsModal(true); // Add this line to show the modal
        alert(`พบ ${formattedCLOs.length} CLO สำหรับปีที่เลือก`);
      } else {
        alert("ไม่พบข้อมูล CLO");
      }
    } catch (error) {
      console.error("Error fetching CLOs:", error);
      alert("เกิดข้อผิดพลาดในการดึงข้อมูล CLO");
    }
  };

  // รีเซ็ตคะแนนของการบ้าน
  const resetHomeworkScores = (clos) => {
    const updatedHomeworks = homeworks.map((hw) => {
      const newScores = {};
      clos.forEach((clo) => {
        // ใช้ CLO_id ตามโครงสร้างที่ API ส่งกลับมา
        newScores[clo.CLO_id] = 0;
      });

      return {
        ...hw,
        scores: newScores,
      };
    });

    setHomeworks(updatedHomeworks);
    setValidationErrors({});
  };
  const fetchAssignmentCLOs = async (assignmentId) => {
    try {
      const response = await axios.get(
        `/api/get_assignment_detail/${assignmentId}`
      );

      if (response.data && response.data.success) {
        // ตั้งค่า CLOs จากข้อมูลที่ได้รับ
        setCLOs(response.data.clos || []);

        // ตั้งค่า weights สำหรับแต่ละ CLO
        const weights = {};
        if (response.data.clos && Array.isArray(response.data.clos)) {
          response.data.clos.forEach((clo) => {
            weights[clo.clo_id] = clo.weight || 0;
          });
        }
        setCloWeights(weights);

        return response.data.clos || [];
      }

      return [];
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล CLO ของ Assignment:", error);
      return [];
    }
  };

  // ตรวจสอบสถานะการโหลด
  if (loading && !universities.length && !semesters.length) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลดข้อมูล...</span>
        </div>
        <span className="ms-3">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  // แสดงข้อผิดพลาด
  if (error) {
    return <div className="alert alert-danger">เกิดข้อผิดพลาด: {error}</div>;
  }

  return (
    <div
      className="mb-3"
      style={{ paddingTop: "80px", maxWidth: "1200px", marginLeft: "20px" }}>
      {/* Fixed Header with Tabs and Filters */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          marginLeft: "250px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #eee",
        }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 0",
            marginLeft: "15px",
            padding: "0 15px",
          }}>
          <h3
            className="mb-0"
            style={{ fontSize: "1.4rem", padding: "10px 0", marginTop: 15 }}>
            {t("Course Information")}
          </h3>

          {/* แถบเมนู */}
          <ul
            className="tab-bar"
            style={{
              margin: 0,
              padding: "5px 0 10px 5px",
              borderBottom: "none",
            }}>
            {(role == "Curriculum Admin" || role === "Instructor") && (
              <li
                className={`tab-item ${activeTab === 0 ? "active" : ""}`}
                onClick={() => handleTabClick(0)}>
                {t("General Information")}
              </li>
            )}
            {(role == "Curriculum Admin" || role === "Instructor") && (
              <li
                className={`tab-item ${activeTab === 1 ? "active" : ""}`}
                onClick={() => handleTabClick(1)}>
                {t("Course Learning Outcomes (CLO)")}
              </li>
            )}
            {(role == "Curriculum Admin" || role === "Instructor") && (
              <li
                className={`tab-item ${activeTab === 3 ? "active" : ""}`}
                onClick={() => handleTabClick(3)}>
                {t("CLO-PLO Mapping")}
              </li>
            )}
            {(role == "Curriculum Admin" || role === "Instructor") && (
              <li
                className={`tab-item ${activeTab === 4 ? "active" : ""}`}
                onClick={() => handleTabClick(4)}>
                {t("Assignment")}
              </li>
            )}
            {(role == "Curriculum Admin" || role === "Instructor") && (
              <li
                className={`tab-item ${activeTab === 2 ? "active" : ""}`}
                onClick={() => handleTabClick(2)}>
                {t("Course-CLO Mapping")}
              </li>
            )}
          </ul>

          {/* 5 Filters in one row */}
          <div
            className="d-flex flex-row"
            style={{ flexWrap: "nowrap", marginTop: "0px" }}>
            <div className="mb-3 me-2" style={{ width: "300px" }}>
              <label className="form-label text-start">
                {t("Choose a university")}
              </label>
              <select
                className="form-select"
                value={selectedUniversity}
                onChange={(e) =>
                  handleFilterChange("university", e.target.value)
                }>
                <option value="">{t("Select University")}</option>
                {universities.map((university) => (
                  <option
                    key={university.university_id}
                    value={university.university_id}>
                    {university.university_name_en} (
                    {university.university_name_th})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3 me-2" style={{ width: "350px" }}>
              <label className="form-label text-start">
                {t("Choose a Faculty")}
              </label>
              <select
                className="form-select"
                value={selectedFaculty || ""}
                onChange={(e) => handleFilterChange("faculty", e.target.value)}
                disabled={!selectedUniversity}>
                <option value="">{t("Select Faculty")}</option>
                {facultys.map((faculty) => (
                  <option key={faculty.faculty_id} value={faculty.faculty_id}>
                    {faculty.faculty_name_th} ({faculty.faculty_name_en})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3 me-2" style={{ width: "200px" }}>
              <label className="form-label text-start">
                {t("Choose a Program")}
              </label>
              <select
                className="form-select"
                value={selectedProgram}
                onChange={(e) => handleFilterChange("program", e.target.value)}
                disabled={!selectedFaculty}>
                <option value="">{t("Select Program")}</option>
                {getUniquePrograms(programs).map((program) => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3 me-2" style={{ width: "90px" }}>
              <label className="form-label">{t("Year")}</label>
              <select
                className="form-select"
                value={selectedYear}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                disabled={!selectedProgram}>
                <option value="">{t("Select Year")}</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3 me-2" style={{ width: "180px" }}>
              <label className="form-label">{t("Semester")}</label>
              <select
                className="form-select"
                name="semester_id"
                value={newCourse.semester_id}
                onChange={handleCourseChange}
                disabled={!selectedYear}>
                <option value="">{t("Select Semester")}</option>
                {semesters && semesters.length > 0 ? (
                  semesters.map((semester) => (
                    <option
                      key={semester.semester_id}
                      value={semester.semester_id}>
                      {semester.semester_name}
                    </option>
                  ))
                ) : (
                  <option value="">No semesters available</option>
                )}
              </select>
            </div>
          </div>
          {/* <SelectorSection /> */}
        </div>
      </div>

      {/* เพิ่ม padding ด้านบนของเนื้อหาเพื่อไม่ให้โดนแถบเมนูทับ */}
      <div
        style={{
          paddingTop: "10px", // ต้องเพิ่ม padding ให้มากพอสำหรับความสูงของแถบเมนู
          padding: "120px 0px 0 0px",
        }}>
        {/* Tab content - Course Information */}
        <div
          className={`tab-content ${activeTab === 0 ? "active" : "hidden"}`}
          style={{ marginTop: "10px" }}>
          <h3>{t("Course Management")}</h3>
          <hr className="my-4" />

          {role == "Curriculum Admin" && (
            <AddCourse
              selectedProgram={selectedProgram}
              newCourse={newCourse}
              handleCourseChange={handleCourseChange}
              addCourse={addCourse}
              allFiltersSelected={allFiltersSelected}
              selectedYear={selectedYear}
              selectedSemesterId={selectedSemesterId}
              fetchCourse={fetchAllCourseByProgram}
            />
          )}

          {role == "Curriculum Admin" || role == "Instructor"}
          <CourseTable
            course_list={courseList}
            deleteCourse={deleteCourse}
            onCourseUpdated={() => fetchAllCourseByProgram(selectedProgram)}
          />
        </div>

        <div
          className={`tab-content ${activeTab === 1 ? "active" : "hidden"}`}
          style={{ marginTop: "0px" }}>
          <div className="row" style={{ padding: "0px 10px 0 10px" }}>
            <div className="col-md-3">
              <label className="form-label text-start">Choose a Course</label>
              <select
                className="form-select"
                value={selectedCourseId || ""}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                }}
                disabled={!newCourse.semester_id}>
                <option value="" disabled>
                  Select Course
                </option>
                {Array.from(
                  new Map(
                    courses.map((course) => [course.course_name, course]) // กรองชื่อซ้ำออก
                  ).values()
                ).map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {`${course.course_id} - ${course.course_name} (${course.course_engname})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <h3>CLO Management</h3>
            <hr className="my-4" />

            {/* CLO List Section */}
            <h5>CLO List</h5>

            {role === "Curriculum Admin" && (
              <div className="action-buttons">
                <div className="button-group">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn"
                    style={{ backgroundColor: "#FF8C00", color: "white" }}
                    disabled={
                      !selectedProgram ||
                      !selectedCourseId ||
                      !selectedSemesterId ||
                      !selectedYear
                    }>
                    Add CLO
                  </button>

                  {/* <button
                    onClick={fetchPreviousYearCLOs}
                    className="btn btn-secondary"
                    disabled={
                      !selectedProgram ||
                      !selectedCourseId ||
                      !selectedSemesterId ||
                      !selectedYear
                    }>
                    Load Previous Year CLOs
                  </button> */}
                </div>

                <div className="button-group ms-auto">
                  <button
                    onClick={() =>
                      document.getElementById("uploadExcel").click()
                    }
                    className="btn btn-secondary"
                    disabled={
                      !selectedProgram ||
                      !selectedCourseId ||
                      !selectedSemesterId ||
                      !selectedYear
                    }>
                    Upload Excel
                  </button>
                  <input
                    type="file"
                    id="uploadExcel"
                    style={{ display: "none" }}
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                  />

                  <button
                    onClick={handleUploadButtonClick}
                    className="btn btn-success"
                    disabled={!excelData || excelData.length === 0}>
                    Submit Excel Data
                  </button>
                </div>
              </div>
            )}

            {/* พื้นที่วางข้อมูล */}
            <div
              className="paste-area mt-3"
              style={{ display: showPasteArea ? "block" : "none" }}>
              <div className="card">
                <div className="card-header">
                  <h5>วางข้อมูล CLO</h5>
                  <p className="text-muted mb-0">
                    คัดลอกข้อมูลจาก Excel แล้ววางที่นี่
                    (รองรับทั้งคอลัมน์ที่คั่นด้วย Tab และ Comma)
                  </p>
                </div>
                <div className="card-body">
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="วางข้อมูล CLO ที่นี่... (CLO Code, CLO Name, CLO English Name)"
                    onPaste={handleDirectPaste}></textarea>
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowPasteArea(false)}>
                      ปิด
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Data */}
            {showPreviewModal && (
              <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Preview Excel Data</h5>
                      <button type="button" className="btn-close" onClick={() => setShowPreviewModal(false)}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>CLO Code</th>
                            <th>CLO Name</th>
                            <th>CLO English Name</th>
                          </tr>
                        </thead>
                        {excelData && excelData.length > 0 && (
                          <tbody>
                            {excelData.map((row, index) => {
                              const key = `${row.CLO_code?.trim().toLowerCase()}|${row.CLO_name?.trim().toLowerCase()}|${row.CLO_engname?.trim().toLowerCase()}`;
                              const isExisting = existingCloMap.has(key);
                              const cellStyle = { color: isExisting ? "black" : "red", backgroundColor: isExisting ? "white" : "#ffe6e6" };

                              return (
                                <tr key={index}>
                                  <td style={cellStyle}>{row.CLO_code}</td>
                                  <td style={cellStyle}>{row.CLO_name}</td>
                                  <td style={cellStyle}>{row.CLO_engname}</td>
                                </tr>
                              );
                            })}

                          </tbody>
                        )}
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowPreviewModal(false)}>Cancel</button>
                      <button className="btn btn-success" onClick={handleUploadButtonClick}>Upload</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal for Add CLO */}
          {showAddModal && (
            <div
              className="modal fade show"
              style={{ display: "block" }}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Add New CLO
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                      aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <label>CLO Code:</label>
                    <input
                      type="text"
                      value={editCloCode}
                      onChange={(e) => setEditCloCode(e.target.value)}
                      style={{ width: "100%" }}
                      className="form-control mb-2"
                    />
                    <label>CLO Name:</label>
                    <input
                      type="text"
                      value={editCloName}
                      onChange={(e) => setEditCloName(e.target.value)}
                      style={{ width: "100%" }}
                      className="form-control mb-2"
                    />
                    <label>CLO English Name:</label>
                    <input
                      type="text"
                      value={editCloEngName}
                      onChange={(e) => setEditCloEngName(e.target.value)}
                      style={{ width: "100%" }}
                      className="form-control mb-2"
                    />
                  </div>
                  <div className="modal-footer">
                    <button onClick={handleAddClo} className="btn btn-primary">
                      Add CLO
                    </button>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="btn btn-secondary">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Previous Year CLOs */}
          {showPreviousYearCLOsModal && (
            <div className="modal show" style={{ display: "block" }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">CLOs from Previous Year</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() =>
                        setShowPreviousYearCLOsModal(false)
                      }></button>
                  </div>
                  <div className="modal-body">
                    {previousYearCLOs.length > 0 ? (
                      <div className="card">
                        <div className="card-header bg-primary text-white">
                          Course Learning Outcomes (CLOs)
                        </div>
                        <div className="card-body">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>CLO Code</th>
                                <th>CLO Name (Thai)</th>
                                <th>CLO Name (English)</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {previousYearCLOs.map((clo) => (
                                <tr key={clo.CLO_id}>
                                  <td className="fw-bold">{clo.CLO_code}</td>
                                  <td>{clo.CLO_name}</td>
                                  <td>{clo.CLO_engname}</td>
                                  <td>
                                    <button
                                      className="btn btn-info btn-sm"
                                      onClick={() => {
                                        setEditCloCode(clo.CLO_code);
                                        setEditCloName(clo.CLO_name);
                                        setEditCloEngName(clo.CLO_engname);
                                        setShowAddModal(true);
                                        setShowPreviousYearCLOsModal(false);
                                      }}>
                                      Copy
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-warning text-center">
                        No Course Learning Outcomes (CLOs) found for the
                        selected year
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowPreviousYearCLOsModal(false)}>
                      Close
                    </button>
                    <button
                      onClick={handleUploadPrevious}
                      className="btn btn-success"
                      disabled={
                        !previousYearCLOs || previousYearCLOs.length === 0
                      }>
                      Submit Excel Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* <div className="">
            <div className="card-header"></div>
            <div className="card-body">
              {!(selectedCourseId && selectedSemesterId && selectedYear) ? (
                <p className="text-warning">
                  กรุณาเลือกข้อมูลให้ครบทุกช่องก่อนแสดง CLO
                </p>
              ) : selectedCourseClo.length > 0 ? (
                <div className="plo-table-container">
                  <table className="plo-table">
                    <thead>
                      <tr>
                        <th className="plo-code-col">{t("CLO Code")}</th>
                        <th className="plo-name-col">{t("CLO Name")}</th>
                        {role === "Curriculum Admin" && (
                          <th className="plo-actions-col">{t("Actions")}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {[...selectedCourseClo]
                        .sort((a, b) => {
                          const numA =
                            parseInt(a.CLO_code.replace(/\D/g, ""), 10) || 0;
                          const numB =
                            parseInt(b.CLO_code.replace(/\D/g, ""), 10) || 0;
                          return numA - numB;
                        })
                        .map((clo) => (
                          <tr key={clo.CLO_id}>
                            <td>
                              <div className="plo-cell-content text-center">
                                {clo.CLO_code}
                              </div>
                            </td>
                            <td>
                              <div className="plo-cell-content">
                                {clo.CLO_name}
                              </div>
                              {clo.CLO_engname && (
                                <>
                                  <div className="my-1 border-t border-gray-300"></div>
                                  <div className="plo-cell-secondary">
                                    {clo.CLO_engname}
                                  </div>
                                </>
                              )}
                            </td>
                            {role === "Curriculum Admin" && (
                              <td>
                                <button
                                  className="plo-table-btn plo-edit-btn"
                                  onClick={() =>
                                    handleEditClo(
                                      clo.CLO_id,
                                      selectedCourseId,
                                      selectedSemesterId,
                                      selectedYear
                                    )
                                  }>
                                  {t("Edit")}
                                </button>
                                <button
                                  className="plo-table-btn plo-delete-btn"
                                  onClick={() =>
                                    handleDeleteClo(
                                      clo.CLO_id,
                                      selectedCourseId,
                                      selectedSemesterId,
                                      selectedYear
                                    )
                                  }>
                                  {t("Delete")}
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center">
                  <p>{t("No CLO data available for the selected filters.")}</p>
                </div>
              )}
            </div>
          </div> */}
          {selectedCourseClo.length > 0 ? (
            <CloTable
              role={role}
              cloArray={selectedCourseClo}
              fetchClo={fetchFilteredCourseClo}
            />
          ) : (
            <div className="text-center">
              <p>{t("No CLO data available for the selected filters.")}</p>
            </div>
          )}

          {showEditModal && (
            <div className="modal show" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit CLO</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowEditModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="clo-code" className="form-label">
                        CLO Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="clo-code"
                        value={editCloCode}
                        onChange={(e) => setEditCloCode(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="clo-name" className="form-label">
                        CLO Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="clo-name"
                        value={editCloName}
                        onChange={(e) => setEditCloName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="clo-engname" className="form-label">
                        CLO English Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="clo-engname"
                        value={editCloEngName}
                        onChange={(e) => setEditCloEngName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveClo}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {activeTab === 3 && (
          <CloPloMapping
            selectedProgram={selectedProgram}
            selectedSemester={selectedSemesterId}
            selectedYear={selectedYear}
          />
        )}

        <div
          className={`tab-content ${activeTab === 2 ? "active" : "hidden"}`}
          style={{ marginTop: "0px" }}>
          <div className="row" style={{ padding: "0px 10px 0 10px" }}>
            <div className="col-md-3">
              <label className="form-label text-start">Choose a Course</label>
              <select
                className="form-select"
                value={selectedCourseId || ""}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                }}
                disabled={!newCourse.semester_id}>
                <option value="" disabled>
                  Select Course
                </option>
                {Array.from(
                  new Map(
                    courses.map((course) => [course.course_name, course]) // กรองชื่อซ้ำออก
                  ).values()
                ).map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {`${course.course_id} - ${course.course_name} (${course.course_engname})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showMapping && selectedCourseId ? (
            <CloMapping
              handleEditToggle={handleEditToggle}
              editingScores={editingScores}
              handlePostScores={handlePostScores}
              courseClo={courseClo}
              selectedCourseId={selectedCourseId}
              courses={courses}
              weightEachCourse={allWeights}
              handleEditWeightEachCourse={handleEditWeightEachCourse}
              calculateTotal={calculateTotal}
              selectedSemesterId={selectedSemesterId}
              selectedYear={selectedYear}
              role={role}
            />
          ) : (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p style={{ fontSize: "16px", color: "#666" }}>
                กรุณาเลือกตัวเลือกให้ครบเพื่อแสดงตาราง Course-CLO Mapping
              </p>
            </div>
          )}
        </div>

        {activeTab === 4 && (
          <Assignment
            selectedUniversity={selectedUniversity}
            selectedFaculty={selectedFaculty}
            selectedYear={selectedYear}
            selectedProgram={selectedProgram}
            selectedSemester={selectedSemesterId}
            activeTab={activeTab}
          />
        )}
      </div>
    </div>
  );
}
