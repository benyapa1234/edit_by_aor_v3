import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "./axios";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

function Login({ setRole }) {
  const clientId =
    "958902418959-llvaof6d4td6cicvdd27fltshv63rudo.apps.googleusercontent.com";
  const [profile, setProfile] = useState(null);
  const { t } = useTranslation();

  // const fetchUserRole = async (email) => {
  //   try {
  //     const response = await axios.get("/getUserRole", { params: { email } });
  //     const role = response.data.role;
  //     setProfile((prevProfile) => ({ ...prevProfile, role }));
  //     setRole(role);
  //   } catch (error) {
  //     console.error("Error fetching role:", error);
  //   }
  // };

  // แก้ไขฟังก์ชัน onGoogleSuccess
  const onGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    try {
      const response = await axios.post("/api/auth/login", {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        token: credentialResponse.credential,
      });

      const { role, token } = response.data;
      setProfile({ ...decoded, role });
      setRole(role);

      // เก็บข้อมูลใน localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_role", role);
      localStorage.setItem(
        "user_profile",
        JSON.stringify({ ...decoded, role })
      );
    } catch (error) {
      console.error("Error during backend authentication:", error.message);
    }
  };

  // เพิ่มฟังก์ชันตรวจสอบ token เมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");

      if (token) {
        try {
          // ตรวจสอบ token กับ backend
          const response = await axios.get("/api/auth/verify-token", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            // ถ้า token ยังไม่หมดอายุ
            const userData = response.data.user;
            setProfile({ ...userData });
            setRole(userData.role);
          } else {
            // ถ้า token ไม่ถูกต้องหรือหมดอายุ
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_role");
            localStorage.removeItem("user_profile");
          }
        } catch (error) {
          // กรณีเกิดข้อผิดพลาดในการตรวจสอบ token
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_profile");
        }
      }
    };

    checkAuth();
  }, []);

  // แก้ไขฟังก์ชัน handleLogout
  const handleLogout = () => {
    setProfile(null);
    setRole(null);

    // ลบข้อมูลใน localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_profile");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-container">
        <div className="login-card">
          {!profile ? (
            <>
              <h2 className="login-title">{t("LOGIN")}</h2>
              <div className="login-buttons">
                <GoogleLogin
                  onSuccess={onGoogleSuccess}
                  onError={() => console.log("Login Failed")}
                />
              </div>
            </>
          ) : (
            <div className="user-profile">
              <h2>{t("Welcome")}</h2>
              <h2>{profile.name}</h2>
              <p>
                {t("Email")}: {profile.email}
              </p>
              <p>
                {t("Role")}: {profile.role}
              </p>
              <button className="logout-button" onClick={handleLogout}>
                {t("Logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
