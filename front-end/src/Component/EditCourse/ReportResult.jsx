import styles from "./styles/ReportResult.module.css";

export default function ReportResult({ messages, onClose }) {
  return (
    <div className={styles.container}>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.table_row}>
              <th className={styles.table_header}>รหัสวิชา</th>
              <th className={styles.table_header}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.course.course_id} className={styles.table_row}>
                <td className={styles.table_cell}>
                  {msg.course.course_id} {msg.course.course_name}
                </td>
                <td className={styles.table_cell}>{msg.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className={styles.btn_close}>
          Close
        </button>
      </div>
    </div>
  );
}
