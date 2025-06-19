import { useState } from "react";
import styles from "./styles/EditClo.module.css";
import { useTranslation } from "react-i18next";

export default function EditCloModal({ clo, onSave, onClose }) {
  const { t } = useTranslation();

  const [cloId, setCloId] = useState(clo?.clo_id || "");
  const [cloCode, setCloCode] = useState(clo?.clo_code || "");
  const [cloName, setCloName] = useState(clo?.clo_name || "");
  const [cloEngName, setCloEngName] = useState(clo?.clo_engname || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedClo = {
      ...clo,
      clo_id: cloId,
      clo_code: cloCode,
      clo_name: cloName,
      clo_engname: cloEngName,
    };
    onSave(updatedClo);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {t("Edit CLO")} id {clo.clo_id}
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>{t("CLO Code")}</label>
            <input
              type="text"
              value={cloCode}
              onChange={(e) => setCloCode(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t("CLO Name (Local Language)")}
            </label>
            <textarea
              value={cloName}
              onChange={(e) => setCloName(e.target.value)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t("CLO Name (English)")}</label>
            <textarea
              value={cloEngName}
              onChange={(e) => setCloEngName(e.target.value)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.btnSave}>
              {t("Save")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnCancel}>
              {t("Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
