import styles from "./StudentTable.module.css";

export default function StudentTable({ students }) {
  return (
    <div className={styles.scroll_box}>
      <table className={styles.table_container}>
        <thead>
          <tr>
            <th className={styles.row}>Student ID</th>
            <th className={styles.row}>Name</th>
          </tr>
        </thead>
        <tbody>
          {students &&
            students.map((student, index) => (
              <tr key={index}>
                <td className={styles.row}>{student.student_id}</td>
                <td className={styles.row}>{student.fullname}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
