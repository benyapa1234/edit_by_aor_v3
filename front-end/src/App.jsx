// app.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
// import ViewCourseInfo from "./ViewCourseInfo.jsx";
import ViewChart from "./ViewChart.jsx";
import Login from "./Login.jsx";
import Navbar from "./Component/Navbar.jsx";
import "./styles.css";
import "./i18n.js";
import AboutData from "./aboutData.jsx";
import NotFound from "./Component/NotFound.jsx";
import EditProgram from "./Component/EditProgram.jsx";
// import EditPLO from './Component/EditPLO.jsx';
import EditCourse from "./Component/EditCourse.jsx";
// import EditCLO from './Component/EditCLO.jsx';
import StudentData from "./Component/StudentData.jsx";
import React, { useState, useEffect } from "react";
import ManageAccount from "./Component/manageAccount.jsx";

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // ตรวจสอบ authentication เมื่อแอปโหลด
    const userRole = localStorage.getItem("user_role");
    const userProfile = localStorage.getItem("user_profile");

    if (userRole && userProfile) {
      setRole(userRole);
    }
  }, []);

  return (
    <>
      <Navbar role={role} />
      <div className="">
        <Routes>
          <Route path="/" element={<Login setRole={setRole} />} />
          {/* <Route path="/ViewCourseInfo" element={<ViewCourseInfo />} /> */}
          <Route path="/ViewChart" element={<ViewChart />} />
          <Route path="/StudentData" element={<StudentData />} />
          <Route path="/aboutData" element={<AboutData />} />
          <Route path="/editprogram" element={<EditProgram />} />
          {/* <Route path="/editplo" element={<EditPLO/>} /> */}
          <Route path="/editcourse" element={<EditCourse />} />
          <Route path="/manageAccount" element={<ManageAccount />} />
          {/* <Route path="/editclo" element={<EditCLO />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
