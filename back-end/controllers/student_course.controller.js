import pool from "../utils/db.js";

export async function addManyFromExcel(req, res) {
  const { course_id, section_id } = req.query;
  const { students } = req.body;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  let message = [];

  try {
    const queryInsert = `INSERT INTO student_course (student_id, course_id, section_id) VALUES (?, ?, ?)`;

    const queryChecked = `SELECT student_id FROM student_course WHERE student_id=? AND course_id=? AND section_id=?`;

    const queryGetProgramIdFromCourse = `SELECT program_id FROM program_course WHERE course_id=? LIMIT 1;`;

    const queryCheckedStudent = `SELECT id FROM student_program WHERE student_id=? AND program_id=?;`;

    for (let i = 0; i < students.length; i++) {
      const [program_id] = await conn.query(queryGetProgramIdFromCourse, [
        course_id,
      ]);
      const [isInProgram] = await conn.query(queryCheckedStudent, [
        students[i].student_id,
        program_id.program_id,
      ]);

      if (isInProgram) {
        const [isInCourse] = await conn.query(queryChecked, [
          students[i].student_id,
          course_id,
          section_id,
        ]);
        if (isInCourse) {
          message.push({
            student_id: students[i].student_id,
            status: "นักศึกษาคนนี้ได้ลงทะเบียนเรียนในรายวิชานี้แล้ว",
          });
          continue;
        } else {
          await conn.query(queryInsert, [
            students[i].student_id,
            course_id,
            section_id,
          ]);
          message.push({
            student_id: students[i].student_id,
            status: "เพิ่มนักศึกษาในรายวิชาเรียบร้อยแล้ว",
          });
        }
      } else {
        message.push({
          student_id: students[i].student_id,
          status:
            "นักศึกษาคนนี้ไม่ได้ลงทะเบียนในหลักสูตรที่เกี่ยวข้องกับรายวิชานี้",
        });
        continue;
      }
    }
    await conn.commit();
    res.status(200).json({ message });
  } catch (error) {
    conn.rollback();
    res.status(500).json({ message: "Error student course", error: error });
  }
}

export async function getAllCourse(req, res) {
  const { student_id } = req.params;

  try {
    const query = `SELECT s.student_id, c.*
    FROM student_course AS sc
    LEFT JOIN course AS c ON c.course_id=sc.course_id
    LEFT JOIN student AS s ON s.student_id=sc.student_id
    WHERE s.student_id=?`;

    const result = await pool.query(query, [student_id]);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetch all course from student" });
  }
}

export async function getAllStudentFromCourse(req, res) {
  const { course_id, section_id } = req.query;

  try {
    const query = `SELECT s.student_id, CONCAT(s.first_name, ' ', s.last_name) AS fullname,sc.section_id, c.*
      FROM student_course AS sc
      LEFT JOIN student AS s ON sc.student_id=s.student_id
      LEFT JOIN course AS c ON c.course_id=sc.course_id
      WHERE sc.section_id=? AND c.course_id=? ORDER BY s.student_id ASC`;
    const result = await pool.query(query, [section_id, course_id]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetch student from course",
      error: error.message,
    });
  }
}
