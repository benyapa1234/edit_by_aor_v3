import React, { useEffect, useRef, useState } from "react";
import TeamData from "./assets/TeamData.js";
import { useTranslation } from "react-i18next";
import "./styles.css";

const AboutData = () => {
  // เรียกใช้ useTranslation ภายในฟังก์ชัน component
  const { t, i18n } = useTranslation();
  
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const versionHistory = [
    {
      version: "1.0",
      changes: [
        t("design_system_structure"),
        t("develop_basic_system"),
        t("user_authentication_system")
      ],
    },
    {
      version: "2.0",
      changes: [
        t("improve_user_interface"),
        t("add_dashboard_feature"),
        t("improve_performance"),
        t("support_multiple_languages")
      ],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // ฟังก์ชันสำหรับจัดการเมื่อรูปภาพมีปัญหาในการโหลด
  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.src = `${window.location.origin}/images/placeholder.jpg`;
    e.target.style.backgroundColor = "#f0f0f0";
  };

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>{t('ABOUT')}</h1>
        <div className="version-history-link" onClick={toggleModal}>
          {t('Version_History')}
        </div>
      </div>

      {/* Version 1 Section */}
      <div className="version-section">
        <h2>{t('Version')} 1</h2>
        <div className="team-members">
          {TeamData.slice(0, 2).map((member, index) => (
            <div key={index} className="team-member">
              <div className="member-image">
                <img 
                  src={member.image} 
                  alt={member.name_th} 
                  onError={handleImageError}
                />
              </div>
              <div className="member-info">
                <div className="member-name-th">{member.name_th}</div>
                <div className="member-name-eng">{member.name_eng}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version 2 Section */}
      <div className="version-section">
        <h2>{t('Version')} 2</h2>
        <div className="team-members">
          {TeamData.slice(2, 5).map((member, index) => (
            <div key={index} className="team-member">
              <div className="member-image">
                <img 
                  src={member.image} 
                  alt={member.name_th} 
                  onError={handleImageError}
                />
              </div>
              <div className="member-info">
                <div className="member-name-th">{member.name_th}</div>
                <div className="member-name-eng">{member.name_eng}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adviser Section */}
      <div className="version-section">
        <h2>{t('Adviser')}</h2>
        <div className="team-members">
          {TeamData.slice(5, 7).map((member, index) => (
            <div key={index} className="team-member">
              <div className="member-image">
                <img 
                  src={member.image} 
                  alt={member.name_th} 
                  onError={handleImageError}
                />
              </div>
              <div className="member-info">
                <div className="member-name-th">{member.name_th}</div>
                <div className="member-name-eng">{member.name_eng}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version History Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h2>{t('Version_History')}</h2>
              <button className="close-button" onClick={toggleModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <table className="version-table">
                <thead>
                  <tr>
                    <th>{t('Version')}</th>
                    <th>{t('Changes')}</th>
                  </tr>
                </thead>
                <tbody>
                  {versionHistory.map((item, index) => (
                    <tr key={index}>
                      <td>{item.version}</td>
                      <td>
                        <ul className="changes-list">
                          {item.changes.map((change, changeIndex) => (
                            <li key={changeIndex}>{change}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutData;