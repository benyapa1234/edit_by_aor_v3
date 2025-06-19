import styles from "./ReportStudentAction.module.css";

export default function ReportSubmitAction({ messages, onClose }) {
  return (
    <div className={styles.container}>
      <div className={styles.table_container}>
        <h2 className={styles.title}>ผลการเพิ่มนักศึกษา</h2>
        <table className={styles.table}>
          <thead>
            <tr className={styles.header_wrapper}>
              <th className={styles.th}>รหัสนักศึกษา</th>
              <th className={styles.th}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.student_id}>
                <td className={styles.td}>{msg.student_id}</td>
                <td className={styles.td}>{msg.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.button_wrapper}>
          <button onClick={onClose} className={styles.close_button}>
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
