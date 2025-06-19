import React, { useState, useEffect, useRef } from "react";
import {
  Link,
  useMatch,
  useResolvedPath,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import "../styles.css";

export default function Navbar({ role }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate(); // เพิ่ม useNavigate สำหรับการ redirect

  // State สำหรับจัดการ dropdown ที่กำลังแสดง
  const [activeDropdown, setActiveDropdown] = useState(null);

  // สร้าง refs
  const programDropdownRef = useRef(null);
  const courseDropdownRef = useRef(null);
  const homeLinkRef = useRef(null);
  const navListRef = useRef(null);
  const activeItemRef = useRef(null);
  const languageDropdownRef = useRef(null);

  // State สำหรับการติดตามแถบอนิเมชั่น
  const [animationStyle, setAnimationStyle] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // ตรวจสอบว่าเส้นทางปัจจุบันอยู่ในกลุ่มเมนูไหน
  const isProgramPath =
    location.pathname === "/editprogram" || location.pathname === "/editplo";
  const isCoursePath =
    location.pathname === "/editcourse" || location.pathname === "/editclo";
  const isHomePath = location.pathname === "/";

  // เพิ่ม Effect ใหม่เพื่อรีเซ็ต dropdown เมื่อเปลี่ยนหน้า
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  // ฟังก์ชันสำหรับอัพเดทตำแหน่งของแถบอนิเมชั่น
  const updateAnimationBar = (element) => {
    if (element) {
      const width = element.offsetWidth;
      const left = element.offsetLeft;
      setAnimationStyle({
        width: `${width}px`,
        left: `${left}px`,
      });
    }
  };

  // ตั้งค่าแถบอนิเมชั่นตามเมนูที่ active
  useEffect(() => {
    if (isHomePath) {
      setAnimationStyle({
        width: "0",
        left: "0",
      });
      return;
    }

    if (isProgramPath && programDropdownRef.current) {
      updateAnimationBar(programDropdownRef.current);
      return;
    }

    if (isCoursePath && courseDropdownRef.current) {
      updateAnimationBar(courseDropdownRef.current);
      return;
    }

    if (activeItemRef.current) {
      updateAnimationBar(activeItemRef.current);
    }

    if (activeDropdown === "language" && languageDropdownRef.current) {
      updateAnimationBar(languageDropdownRef.current);
      return;
    }
  }, [location.pathname, isProgramPath, isCoursePath, isHomePath]);

  // Effect สำหรับจัดการ active items ใน dropdown menus
  useEffect(() => {
    const setActiveMenuItems = () => {
      document.querySelectorAll(".dropdown-menu li").forEach((item) => {
        item.classList.remove("active");
      });

      if (isProgramPath) {
        const programLinks = document.querySelectorAll("#program-dropdown a");
        programLinks.forEach((link) => {
          if (link.getAttribute("href") === location.pathname) {
            link.parentElement.classList.add("active");
          }
        });
      } else if (isCoursePath) {
        const courseLinks = document.querySelectorAll("#course-dropdown a");
        courseLinks.forEach((link) => {
          if (link.getAttribute("href") === location.pathname) {
            link.parentElement.classList.add("active");
          }
        });
      }
    };

    setTimeout(setActiveMenuItems, 100);
  }, [location.pathname, isProgramPath, isCoursePath]);

  // ฟังก์ชันจัดการ dropdown hover
  const handleDropdownEnter = (dropdownId) => {
    setActiveDropdown(dropdownId);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    setActiveDropdown(null);
  };

  // ฟังก์ชันตรวจสอบว่า URL ตรงกับเส้นทางที่กำหนดหรือไม่
  const isPathActive = (path) => {
    return location.pathname === path;
  };

  // เพิ่มฟังก์ชัน handleLogout
  const handleLogout = () => {
    // ลบข้อมูลใน localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_profile");
    localStorage.removeItem("token_saved_at");

    // ส่งผู้ใช้กลับไปที่หน้า login
    navigate("/");

    // ถ้ามีฟังก์ชัน refresh หน้า หรือต้องการ reload
    window.location.reload();

    console.log("Logged out successfully");
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link
          to="/"
          className="site-title"
          ref={homeLinkRef}
          style={{ color: isHomePath ? "#FF8C00" : "#000000" }}
          onClick={() => {
            // เมื่อคลิกที่ PLOCLO ให้ซ่อนแถบอนิเมชั่น
            setAnimationStyle({
              width: "0",
              left: "0",
            });
          }}>
          PLOCLO
        </Link>
      </div>

      <div className="nav-right">
        <ul className="nav-list" ref={navListRef}>
          {role === "Curriculum Admin" && (
            <CustomLink
              to="/EditProgram"
              onMouseEnter={(e) => updateAnimationBar(e.currentTarget)}
              onMouseLeave={() =>
                activeItemRef.current &&
                updateAnimationBar(activeItemRef.current)
              }
              setActiveRef={activeItemRef}>
              {t("Program")}
            </CustomLink>
          )}

          {/* Course Dropdown for System Admin and Curriculum Admin */}
          {(role === "Instructor" || role === "Curriculum Admin") && (
            <CustomLink
              to="/editcourse"
              onMouseEnter={(e) => updateAnimationBar(e.currentTarget)}
              onMouseLeave={() =>
                activeItemRef.current &&
                updateAnimationBar(activeItemRef.current)
              }
              setActiveRef={activeItemRef}>
              {t("Course")}
            </CustomLink>
          )}

          {(role === "Student" ||
            role === "Instructor" ||
            role === "Curriculum Admin" ||
            role === "System Admin") && (
            <CustomLink
              to="/ViewChart"
              onMouseEnter={(e) => updateAnimationBar(e.currentTarget)}
              onMouseLeave={() =>
                activeItemRef.current &&
                updateAnimationBar(activeItemRef.current)
              }
              setActiveRef={activeItemRef}>
              {t("ViewChart")}
            </CustomLink>
          )}

          <CustomLink
            to="/aboutData"
            onMouseEnter={(e) => updateAnimationBar(e.currentTarget)}
            onMouseLeave={() =>
              activeItemRef.current && updateAnimationBar(activeItemRef.current)
            }
            setActiveRef={activeItemRef}>
            {t("About")}
          </CustomLink>

          {role === "System Admin" && (
            <CustomLink
              to="/manageAccount"
              onMouseEnter={(e) => updateAnimationBar(e.currentTarget)}
              onMouseLeave={() =>
                activeItemRef.current &&
                updateAnimationBar(activeItemRef.current)
              }
              setActiveRef={activeItemRef}>
              {t("Manage Accounts")}
            </CustomLink>
          )}

          {/* แถบอนิเมชั่น */}
          <div className="animation-bar" style={animationStyle}></div>
        </ul>

        <div
          className="language-selector"
          onMouseEnter={() => handleDropdownEnter("language")}
          onMouseLeave={() => handleDropdownLeave()}>
          <span className="language-label">{t("Select Language")}</span>
          <ul
            className={`language-menu d-grid gap-0 ${activeDropdown === "language" ? "show" : ""}`}>
            <li onClick={() => changeLanguage("th")}>Thai</li>
            <li onClick={() => changeLanguage("en")}>English</li>
            {/* <li onClick={() => changeLanguage('ch')}>Chinese</li> */}
          </ul>
        </div>
        {/* เพิ่มปุ่ม Logout ถ้ามี role (ล็อกอินแล้ว) */}
        {role && (
          <li className="logout-nav-item">
            <button
              onClick={handleLogout}
              className="logout-button"
              onMouseEnter={(e) => updateAnimationBar(e.currentTarget)}
              onMouseLeave={() =>
                activeItemRef.current &&
                updateAnimationBar(activeItemRef.current)
              }>
              {t("Logout")}
            </button>
          </li>
        )}
      </div>
    </nav>
  );
}

function CustomLink({
  to,
  children,
  onMouseEnter,
  onMouseLeave,
  setActiveRef,
  ...props
}) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  const linkRef = useRef(null);
  const location = useLocation();

  // ตรวจสอบว่า URL ปัจจุบันอยู่ในเส้นทางของเมนูดรอปดาวน์หรือไม่
  const isProgramPath =
    location.pathname === "/editprogram" || location.pathname === "/editplo";
  const isCoursePath =
    location.pathname === "/editcourse" || location.pathname === "/editclo";

  // ถ้าลิงค์นี้ active และไม่ได้อยู่ในดรอปดาวน์เมนู ให้เก็บ ref ไว้ใน parent component
  useEffect(() => {
    // ถ้าอยู่ในเส้นทางของเมนูดรอปดาวน์ จะไม่อัพเดต activeItemRef
    if (isProgramPath || isCoursePath) {
      return;
    }

    if (isActive && linkRef.current && setActiveRef) {
      setActiveRef.current = linkRef.current;
    }
  }, [isActive, setActiveRef, location.pathname, isProgramPath, isCoursePath]);

  return (
    <li
      className={isActive ? "active" : ""}
      ref={linkRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
