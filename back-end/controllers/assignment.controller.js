import pool from "../utils/db.js";

export async function getAll(req, res) {
  const query = `
    SELECT ass.assignment_id, ass.assignment_name, c.course_name, c.course_id, p.program_name, p.year, pc.semester_id, pc.section_id,  u.university_name_en
    FROM assignments AS ass
    LEFT JOIN program_course AS pc ON pc.program_course_id=ass.program_course_id
    LEFT JOIN program AS p ON p.program_id=pc.program_id
    LEFT JOIN course AS c ON pc.course_id=c.course_id
    LEFT JOIN university AS u ON u.university_id=ass.university_id;
  `;

  try {
    const result = await pool.query(query);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching all assignments" });
  }
}

export async function createOne(req, res) {
  const {
    program_course_id,
    name,
    description,
    max_score,
    due_date,
    university_id,
    faculty_id,
    clos,
  } = req.body;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  const totalWeight = clos.reduce(
    (sum, clo) => sum + parseFloat(clo.weight),
    0
  );
  if (Math.abs(totalWeight - 1.0) > 0.001) {
    return res.status(400).json({ message: "CLO weights must sum up to 1.0" });
  }

  try {
    const assignmentQuery = `
      INSERT INTO assignments (program_course_id, assignment_name, description, total_score, due_date, faculty_id, university_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await conn.query(assignmentQuery, [
      program_course_id,
      name,
      description,
      max_score,
      due_date,
      university_id,
      faculty_id,
    ]);

    const assignmentId = Number(result.insertId);

    if (clos && clos.length > 0) {
      const cloInsertQuery = `
    INSERT INTO assignment_clo (assignment_id, clo_id, weight)
    VALUES ${clos.map(() => "(?, ?, ?)").join(", ")}
  `;

      const cloValues = clos.flatMap((clo) => [
        assignmentId,
        clo.id,
        parseFloat(clo.weight),
      ]);

      await conn.query(cloInsertQuery, cloValues);
    }

    await conn.commit();
    res
      .status(200)
      .json({ message: "Assignment created successfully", assignmentId });
  } catch (error) {
    conn.rollback();
    res
      .status(500)
      .json({ message: "Error while create assignment", error: error.message });
  } finally {
    conn.release();
  }
}

export async function getManyByProgramCourse(req, res) {
  const { program_course_id } = req.params;
  try {
    const query = `
      SELECT * FROM assignments WHERE program_course_id=?;
    `;
    const result = await pool.query(query, [program_course_id]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error while fetch assignment" });
  }
}

export async function deleteOneById(req, res) {
  const { assignment_id } = req.params;
  try {
    const query = `DELETE FROM assignments WHERE assignment_id = ?`;
    await pool.query(query, [assignment_id]);
    res.status(200).json({ message: "delete successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while delete assignment", error });
  }
}

export async function assignStudent(req, res) {
  const { assignment_id, students } = req.body;
  try {
    if (!assignment_id || !students || !Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    for (const student of students) {
      // เช็กว่า student มีอยู่แล้วไหม
      const [exists] = await pool.query(
        "SELECT 1 FROM student WHERE student_id = ?",
        [student.student_id]
      );

      // ถ้าไม่มี ให้ insert นักเรียนใหม่เข้าไป
      if (exists.length === 0) {
        await pool.query(
          "INSERT INTO student (student_id, firstname, lastname) VALUES (?, ?, ?)",
          [student.student_id, student.firstname, student.lastname]
        );
      }
    }

    // สร้าง values string และ params array
    const values = [];
    const params = [];

    students.forEach((student, index) => {
      values.push(`(?, ?)`);
      params.push(assignment_id);
      params.push(student.student_id);
    });

    const query = `
      INSERT INTO assignment_student (assignment_id, student_id)
      VALUES ${values.join(", ")}
    `;
    // ใส่ assignment_id เป็นพารามิเตอร์ตัวแรก
    await pool.query(query, params);

    res.status(200).json({ message: "Students assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while assigning students", error });
  }
}

export async function getManyWithScore(req, res) {
  const { assignment_id } = req.params;

  try {
    const query = `
      SELECT ass_st.id, a.assignment_id, a.assignment_name, s.first_name, s.last_name, ass_g.score
      FROM assignment_student AS ass_st
      LEFT JOIN student AS s ON ass_st.student_id=s.student_id
      LEFT JOIN assignments AS a ON a.assignment_id=ass_st.assignment_id
      LEFT JOIN assignment_grade AS ass_g ON ass_st.id=ass_g.assignment_student_id WHERE a.assignment_id=?`;
    const result = await pool.query(query, [assignment_id]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error while update score" });
  }
}

export async function updateScore(req, res) {
  const { student_scores } = req.body;
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    student_scores.map(async (student_score) => {
      const queryCheckExist = `SELECT assignment_student_id FROM assignment_grade WHERE assignment_student_id=?`;
      const exists = await conn.query(queryCheckExist, [student_score.id]);
      console.log(student_score);
      console.log(exists);
      if (exists.length > 0) {
        const updateQuery = `UPDATE assignment_grade SET score=? WHERE assignment_student_id=?`;
        await conn.query(updateQuery, [student_score.score, student_score.id]);
      } else {
        const query = `INSERT INTO assignment_grade (assignment_student_id, score) VALUES (?, ?)`;
        await conn.query(query, [student_score.id, student_score.score || 0]);
      }
    });
    conn.commit();
    conn.release();
    res.status(200).json({ message: "test" });
  } catch (error) {
    res.status(500).json({ messsage: "Test" });
  }
}

export async function getAssignmentClos(req, res) {
  const { assignment_id } = req.params;

  try {
    const query = `
      SELECT ac.clo_id, ac.weight, clo.CLO_code, clo.CLO_name
      FROM assignment_clo AS ac
      JOIN clo ON clo.CLO_id = ac.clo_id
      WHERE ac.assignment_id = ?
    `;
    const result = await pool.query(query, [assignment_id]);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching CLOs for assignment", error });
  }
}

// export async function getManyBy(req, res) {
//   const { program_course_id}

//   let query = `SELECT ass.assignment_id, ass.assignment_name, c.course_name, c.course_id, p.program_name, p.year, pc.semester_id, pc.section_id,  u.university_name_en
//     FROM assignments AS ass
//     LEFT JOIN program_course AS pc ON pc.program_course_id=ass.program_course_id
//     LEFT JOIN program AS p ON p.program_id=pc.program_id
//     LEFT JOIN course AS c ON pc.course_id=c.course_id
//     LEFT JOIN university AS u ON u.university_id=ass.university_id;`;
// }
