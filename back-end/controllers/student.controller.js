import pool from "../utils/db.js";

async function insertStudent(req, res) {
  const students = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: "No valid student data provided" });
  }

  try {
    let values = ``;

    students.map((student) => {
      values += `("${student.student_id}", "${student.name}"),`;
    });

    values = values.slice(0, -1) + ";";
    const query = `
      INSERT INTO studentdata (student_id, name)
      VALUES ${values}
    `;

    const conn = await pool.getConnection();
    console.log(query);
    await conn.query(query);
    conn.release();

    res.status(201).json({
      message: "Student data inserted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database insertion failed.",
      error: error.message,
    });
  }
}

async function getAll(req, res) {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(`SELECT * FROM student`);
    res.json(result);
    conn.release();
  } catch (err) {
    res.status(500).send(err);
  }
}

async function deleteOne(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "DELETE FROM studentdata WHERE student_id = ?",
      [id]
    );

    // ตรวจสอบว่าไม่มีการลบข้อมูล
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
    conn.release();
  } catch (err) {
    console.error("Error deleting student:", err);
    res
      .status(500)
      .json({ message: "Error deleting student", error: err.message });
  }
}

async function saveScore(req, res) {
  const { assignment_id, scores } = req.body;

  console.log("ได้รับข้อมูลคะแนนจาก frontend:", {
    assignment_id,
    scoresCount: scores?.length,
  });

  // ตรวจสอบข้อมูลที่ส่งมา
  if (
    !assignment_id ||
    !scores ||
    !Array.isArray(scores) ||
    scores.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "ข้อมูลไม่ถูกต้อง กรุณาระบุ assignment_id และข้อมูลคะแนน",
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // เริ่ม transaction
    await conn.beginTransaction();

    // ตรวจสอบว่า assignment_id มีอยู่จริง
    const assignmentCheck = await conn.query(
      "SELECT assignment_id FROM assignments WHERE assignment_id = ?",
      [assignment_id]
    );

    if (!assignmentCheck || assignmentCheck.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูล Assignment ที่ระบุ",
      });
    }

    // วนลูปบันทึกคะแนนแต่ละรายการ
    let successCount = 0;
    let errorCount = 0;

    for (const scoreItem of scores) {
      const { student_id, assignment_clo_id, score } = scoreItem;

      // ตรวจสอบว่ามีข้อมูลคะแนนนี้อยู่แล้วหรือไม่
      const existingRecord = await conn.query(
        `SELECT id FROM student_assignment_scores
                 WHERE student_id = ? AND assignment_id = ? AND assignment_clo_id = ?`,
        [student_id, assignment_id, assignment_clo_id]
      );

      try {
        if (existingRecord && existingRecord.length > 0) {
          // ถ้ามีข้อมูลอยู่แล้ว ให้อัพเดทคะแนน
          await conn.query(
            `UPDATE student_assignment_scores
                         SET score = ?, updated_at = NOW()
                         WHERE id = ?`,
            [score, existingRecord[0].id]
          );
        } else {
          // ถ้ายังไม่มี ให้เพิ่มข้อมูลใหม่
          await conn.query(
            `INSERT INTO student_assignment_scores
                         (student_id, assignment_id, assignment_clo_id, score, created_at)
                         VALUES (?, ?, ?, ?, NOW())`,
            [student_id, assignment_id, assignment_clo_id, score]
          );
        }
        successCount++;
      } catch (error) {
        console.error(
          `Error saving score for student ${student_id}, CLO ${assignment_clo_id}:`,
          error
        );
        errorCount++;
      }
    }

    // Commit transaction
    await conn.commit();

    console.log(
      `บันทึกคะแนนสำเร็จ ${successCount} รายการ, ผิดพลาด ${errorCount} รายการ`
    );

    return res.json({
      success: true,
      message: `บันทึกคะแนนสำเร็จ ${successCount} รายการ${errorCount > 0 ? `, ผิดพลาด ${errorCount} รายการ` : ""}`,
      successCount,
      errorCount,
    });
  } catch (error) {
    console.error("Error saving student scores:", error);

    // Rollback transaction ในกรณีที่เกิดข้อผิดพลาด
    if (conn) {
      await conn.rollback();
    }

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการบันทึกคะแนน",
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
}

async function getStudentsByProgram(req, res) {
  try {
    const { program_id } = req.query;

    // ตรวจสอบว่ามีการส่งค่าที่จำเป็นมาหรือไม่
    if (!program_id) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // ดึงข้อมูลนักศึกษาจากฐานข้อมูล
    const query = `
      SELECT s.student_id, s.first_name, s.last_name, sp.program_id
      FROM student_program AS sp
      LEFT JOIN student AS s ON s.student_id = sp.student_id
      WHERE sp.program_id = ?
      ORDER BY s.student_id ASC
    `;

    const result = await pool.query(query, [program_id]);
    res.json(result);
  } catch (error) {
    console.error("Error fetching students:", error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}

// 2. เพิ่มข้อมูลนักศึกษาใหม่
async function addStudent(req, res) {
  try {
    const { student_id, first_name, last_name, program_id } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!student_id || !first_name || !last_name || !program_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const conn = await pool.getConnection();
    const checkQuery = `
            SELECT student_id, first_name, last_name FROM student
            WHERE student_id = ?
          `;
    const checkResult = await conn.query(checkQuery, [student_id]);
    if (checkResult && checkResult.length > 0) {
      const updateQuery = `
              UPDATE student
              SET first_name = ?, last_name = ?
              WHERE student_id = ?
            `;
      await conn.query(updateQuery, [first_name, last_name, student_id]);
    } else {
      const insertQuery = `
              INSERT INTO student (student_id, first_name, last_name)
              VALUES (?, ?, ?)
            `;
      const insertResult = await conn.query(insertQuery, [
        student_id,
        first_name,
        last_name,
      ]);
    }

    const checkProgramQuery = `
            SELECT student_id FROM student_program WHERE student_id = ?
          `;
    const hasProgram = await conn.query(checkProgramQuery, [student_id]);
    if (hasProgram[0]) {
      const updateProgramQuery = `UPDATE student_program SET program_id = ? WHERE student_id = ?`;
      await conn.query(updateProgramQuery, [program_id, student_id]);
    } else {
      const insertProgramQuery = `INSERT INTO student_program (student_id, program_id) VALUES (?, ?)`;
      const insertProgramResult = await conn.query(insertProgramQuery, [
        student_id,
        program_id,
      ]);
    }

    conn.release();
    res.status(201).json({ message: "insert student successfully." });
  } catch (error) {
    console.error("Error adding student:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Student ID already exists" });
    }

    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}

// 3. อัปเดตข้อมูลนักศึกษา
async function updateStudent(req, res) {
  try {
    const { student_id } = req.params;
    const { first_name, last_name } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!student_id || !first_name || !last_name) {
      return res.status(400).json({
        error: "Missing required fields",
        field: { student_id, first_name, last_name },
      });
    }
    console.log(student_id);
    const conn = await pool.getConnection();

    // ตรวจสอบว่ามีนักศึกษาคนนี้หรือไม่
    const checkQuery = "SELECT student_id FROM student WHERE student_id = ?";
    const checkResult = await conn.query(checkQuery, [student_id]);

    if (!checkResult || checkResult.length === 0) {
      conn.release();
      return res.status(404).json({ error: "Student not found" });
    }

    // อัปเดตข้อมูลนักศึกษา
    const query = `
      UPDATE student
      SET first_name = ?, last_name = ?
      WHERE student_id = ?
    `;

    const values = [first_name, last_name, student_id];
    await conn.query(query, values);

    // ดึงข้อมูลนักศึกษาที่อัปเดตแล้ว
    const updatedStudent = await conn.query(
      "SELECT * FROM student WHERE student_id = ?",
      [student_id]
    );

    conn.release();
    res.status(200).json(updatedStudent[0]);
  } catch (error) {
    console.error("Error updating student:", error);

    // ตรวจสอบการซ้ำกันของข้อมูล (Duplicate key)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Student ID already exists" });
    }

    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}

// 4. ลบข้อมูลนักศึกษา
async function deleteStudent(req, res) {
  try {
    const studentId = req.params.id;

    const conn = await pool.getConnection();

    // ตรวจสอบว่ามีนักศึกษาคนนี้หรือไม่
    const checkQuery = "SELECT student_id FROM student WHERE student_id = ?";
    const checkResult = await conn.query(checkQuery, [studentId]);

    if (!checkResult || checkResult.length === 0) {
      conn.release();
      return res.status(404).json({ error: "Student not found" });
    }

    // ลบข้อมูลนักศึกษา
    const query = "DELETE FROM student WHERE student_id = ?";
    await conn.query(query, [studentId]);

    conn.release();
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}

// 5. นำเข้าข้อมูลนักศึกษาจาก Excel
async function importStudentsFromExcel(req, res) {
  try {
    const studentsData = req.body;

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const conn = await pool.getConnection();

    // เริ่ม transaction
    await conn.beginTransaction();

    try {
      let successCount = 0;
      let errorCount = 0;
      const results = [];

      for (const student of studentsData) {
        try {
          // ตรวจสอบข้อมูลที่จำเป็น
          const { student_id, first_name, last_name, program_id } = student;

          if (!student_id || !first_name || !last_name || !program_id) {
            console.log(program_id);
            errorCount++;
            continue;
          }

          // ตรวจสอบว่ามีนักศึกษารหัสนี้ในโปรแกรมและปีการศึกษานี้หรือไม่
          const checkQuery = `
            SELECT student_id, first_name, last_name FROM student
            WHERE student_id = ?
          `;
          const checkResult = await conn.query(checkQuery, [student_id]);
          if (checkResult && checkResult.length > 0) {
            // อัปเดตข้อมูลที่มีอยู่แล้ว
            const updateQuery = `
              UPDATE student
              SET first_name = ?, last_name = ?
              WHERE student_id = ?
            `;
            await conn.query(updateQuery, [first_name, last_name, student_id]);
          } else {
            // เพิ่มข้อมูลใหม่
            const insertQuery = `
              INSERT INTO student (student_id, first_name, last_name)
              VALUES (?, ?, ?)
            `;
            const insertResult = await conn.query(insertQuery, [
              student_id,
              first_name,
              last_name,
            ]);
          }

          const checkProgramQuery = `
            SELECT student_id FROM student_program WHERE student_id = ?
          `;
          const hasProgram = await conn.query(checkProgramQuery, [student_id]);
          if (hasProgram[0]) {
            const updateProgramQuery = `UPDATE student_program SET program_id = ? WHERE student_id = ?`;
            await conn.query(updateProgramQuery, [program_id, student_id]);
          } else {
            const insertProgramQuery = `INSERT INTO student_program (student_id, program_id) VALUES (?, ?)`;
            const insertProgramResult = await conn.query(insertProgramQuery, [
              student_id,
              program_id,
            ]);
          }

          // ดึงข้อมูลนักศึกษาที่เพิ่ม/อัปเดต
          const studentData = await conn.query(
            "SELECT * FROM student WHERE student_id = ?",
            [student_id]
          );
          results.push(studentData[0]);
          successCount++;
        } catch (error) {
          console.error("Error processing student:", error);
          errorCount++;
        }
      }

      // Commit transaction
      await conn.commit();

      res.status(201).json({
        message: `Successfully processed ${successCount} students, errors: ${errorCount}`,
        successCount,
        errorCount,
        data: results,
      });
    } catch (error) {
      // Rollback transaction ในกรณีที่เกิดข้อผิดพลาด
      console.log(error);
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error importing students:", error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}

export async function getOneById(req, res) {
  const { student_id } = req.params;

  const query = `SELECT
      s.student_id,
      s.first_name,
        s.last_name,
        p.program_name,
        p.program_name_th,
        p.year,
        f.faculty_name_th,
        f.faculty_name_en
    FROM student_program AS st
    LEFT JOIN student AS s ON s.student_id=st.student_id
    LEFT JOIN program AS p ON p.program_id=st.program_id
    LEFT JOIN program_faculty AS pf ON pf.program_id=p.program_id
    LEFT JOIN faculty AS f ON f.faculty_id=pf.faculty_id
    WHERE s.student_id=?`;
  try {
    const result = await pool.query(query, [student_id]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error while get a student by student id",
      error: error.message,
    });
  }
}

export async function getStudentsByCourse(req, res) {
  try {
    const { course_id } = req.params;

    if (!course_id) {
      return res.status(400).json({ error: "Missing course_id parameter" });
    }

    const query = `
      SELECT s.student_id, s.first_name, s.last_name, sc.section_id
      FROM student_course AS sc
      JOIN student AS s ON s.student_id = sc.student_id
      WHERE sc.course_id = ?
      ORDER BY s.student_id ASC
    `;

    const result = await pool.query(query, [course_id]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching students by course:", error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}

export {
  insertStudent,
  getAll,
  deleteOne,
  saveScore,
  getStudentsByProgram,
  addStudent,
  updateStudent,
  deleteStudent,
  importStudentsFromExcel,
};
