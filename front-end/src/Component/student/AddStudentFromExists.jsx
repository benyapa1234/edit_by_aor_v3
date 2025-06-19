import styles from "./AddStudentFromExists.module.css";

const mockStudents = [
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
  { id: "65361588", firstname: "ณัฐพงษ์", lastname: "ปานอินทร์" },
];

export default function AddStudentFromExists() {
  return (
    <div>
      <div className={styles.scroll_box}>
        <table className={styles.table_container}>
          <thead>
            <tr>
              <th className={styles.row}>Student ID</th>
              <th className={styles.row}>First name</th>
              <th className={styles.row}>Last name</th>
              <th className={styles.row}>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockStudents.map((student, index) => (
              <tr key={index}>
                <td className={styles.row}>{student.id}</td>
                <td className={styles.row}>{student.firstname}</td>
                <td className={styles.row}>{student.lastname}</td>
                <td className={styles.row}>
                  <button className="btn btn-success btn-sm me-2">Add</button>
                  <button className="btn btn-danger btn-sm me-2">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
