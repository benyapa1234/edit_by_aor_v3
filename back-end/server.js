import express from "express";
import cors from "cors";
import mariadb from "mariadb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import setCharset from "./middleware/setCharset.js";
import dotenv from "dotenv";

import studentRoutes from "./routes/student.route.js";
import universityRoutes from "./routes/university.route.js";
import assignmentRoutes from "./routes/assignment.route.js";
import programCourseRoutes from "./routes/program_course.route.js";
import authRoutes from "./routes/auth.route.js";
import programRoutes from "./routes/program.route.js";
import ploRoutes from "./routes/plo.route.js";
import courseRoutes from "./routes/course.route.js";
import metaDataRoutes from "./routes/metadata.route.js";
import accountRoutes from "./routes/account.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import studentCourseRoutes from "./routes/student_course.route.js";
import cloRoutes from "./routes/clo.route.js";

dotenv.config();
import pool from "./utils/db.js";

const port = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(setCharset);

app.use("/api/students", studentRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/program-course", programCourseRoutes);
app.use("/api/auth/", authRoutes);
app.use("/api/program", programRoutes);
app.use("/api/plo", ploRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/metadata", metaDataRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/student-course", studentCourseRoutes);
app.use("/api/clo", cloRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// API root route
// app.get("/", (req, res) => {
//   res.send("Server is working");
// });

// API route to get data from database
app.get("/getdata", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(`SELECT * FROM ${table}`);
    res.json(result);
    conn.release();
  } catch (err) {
    res.status(500).send(err);
  }
});

// // API route to insert Studentdata into database ของ นินิว
app.post("/insert", async (req, res) => {
  const data_list = req.body;

  // Validate input data
  if (!data_list || !Array.isArray(data_list) || data_list.length === 0) {
    return res.status(400).json({
      message: "No data provided or data is not in correct format",
    });
  }

  // Prepare the SQL query dynamically
  const columns = Object.keys(data_list[0]).join(",");
  const placeholders = data_list
    .map(
      () =>
        `(${Object.keys(data_list[0])
          .map(() => "?")
          .join(",")})`
    )
    .join(",");
  const data = data_list.reduce(
    (acc, item) => acc.concat(Object.values(item)),
    []
  );

  const query = `
        INSERT INTO StudentData (student_id,name,program_name)
        VALUES ${placeholders}
    `;

  try {
    const conn = await pool.getConnection();
    await conn.query(query, data);
    res.status(201).json({
      message: "Student data inserted successfully",
    });
    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database insertion failed",
      error: err.message,
    });
  }
});

// API route to get data from database
// API route to get all students
// ขึ้นแสดงข้อมูลทุกข้อมูลที่มีอยู่เลย
app.get("/students", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(`SELECT * FROM studentdata`);
    res.json(result);
    conn.release();
  } catch (err) {
    res.status(500).send(err);
  }
});

// เพิ่ม API สำหรับการลบโปรแกรมตาม student_Id
// API สำหรับการลบข้อมูลนักเรียน

// API สำหรับการลบข้อมูลนักเรียน
app.delete("/students/:id", async (req, res) => {
  const { id } = req.params; // รับค่า id จาก URL params

  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "DELETE FROM studentdata WHERE student_id = ?",
      [student_id]
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
});

app.get("/clo", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const query = "SELECT * FROM clo";
    const clos = await conn.query(query);
    res.json(Array.isArray(clos) ? clos : [clos]);
  } catch (err) {
    console.error("Error fetching CLOs:", err);
    res.status(500).json({ success: false, message: "Database error" });
  } finally {
    if (conn) conn.release();
  }
});

app.get("/course-clo", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const query = `select course.course_id, c.CLO_code, course.clo_id
        from clo AS c
        LEFT JOIN course_clo AS course
        ON c.CLO_id = course.clo_id WHERE course.course_id IS NOT NULL;`;
    const clos = await conn.query(query);
    res.json(clos);
  } catch (err) {
    console.error("Error fetching CLOs:", err);
    res.status(500).json({ success: false, message: "Database error" });
  } finally {
    if (conn) conn.release();
  }
});

app.get("/course-clo", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const query = `select course.course_id, c.CLO_code, course.clo_id
        from clo AS c
        LEFT JOIN course_clo AS course
        ON c.CLO_id = course.clo_id WHERE course.course_id IS NOT NULL;`;
    const clos = await conn.query(query);
    res.json(clos);
  } catch (err) {
    console.error("Error fetching CLOs:", err);
    res.status(500).json({ success: false, message: "Database error" });
  } finally {
    if (conn) conn.release();
  }
});

app.get("/course_clo/weight", async (req, res) => {
  const { program_id, course_id, semester_id, year } = req.query;

  if (!program_id || !course_id || !semester_id || !year) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    const query = `
            SELECT
                course_clo.course_clo_id,
                course_clo.course_id,
                course_clo.semester_id,
                course_clo.section_id,
                course_clo.year,
                course_clo.weight,
                clo.CLO_id,
                clo.CLO_code,
                clo.CLO_name,
                clo.CLO_engname,
                clo.timestamp,
                course.course_name,
                course.course_engname
            FROM
                program_course pc
            JOIN
                course_clo ON pc.course_id = course_clo.course_id
                AND pc.semester_id = course_clo.semester_id
                AND pc.year = course_clo.year
            JOIN
                clo ON course_clo.clo_id = clo.CLO_id
            JOIN
                course ON course_clo.course_id = course.course_id
            WHERE
                pc.program_id = ?
                AND course_clo.course_id = ?
                AND course_clo.semester_id = ?
                AND course_clo.year = ?
        `;

    const rows = await conn.query(query, [
      program_id,
      course_id,
      semester_id,
      year,
    ]);

    // บังคับให้ rows เป็น array
    const result = Array.isArray(rows) ? rows : [rows];

    res.json(result);
  } catch (err) {
    console.error("Error fetching course CLOs:", err);
    res.status(500).json({ message: "Database error" });
  } finally {
    if (conn) conn.release();
  }
});

app.post("/course_clo/weight", async (req, res) => {
  // console.log('Received Course-CLO weight data:', JSON.stringify(req.body, null, 2));

  const { program_id, semester_id, section_id, year, scores } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (
    !semester_id ||
    !section_id ||
    !year ||
    !Array.isArray(scores) ||
    scores.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required data or invalid scores array",
    });
  }

  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    const results = {
      success: 0,
      errors: 0,
      details: [],
    };

    // ประมวลผลข้อมูลทีละรายการ
    for (const score of scores) {
      try {
        const { course_id, clo_id, weight } = score;

        if (!course_id || !clo_id || weight === undefined) {
          results.errors++;
          results.details.push({
            error: "Missing required fields",
            data: score,
          });
          continue;
        }

        // แปลงค่า weight เป็น integer
        const weightValue = parseInt(weight);

        // ตรวจสอบว่าข้อมูลมีอยู่แล้วหรือไม่
        const exists = await conn.query(
          "SELECT course_clo_id FROM course_clo WHERE course_id = ? AND clo_id = ? AND semester_id = ? AND section_id = ? AND year = ?",
          [course_id, clo_id, semester_id, section_id, year]
        );

        if (exists && exists.length > 0) {
          // อัพเดตข้อมูลที่มีอยู่
          await conn.query(
            "UPDATE course_clo SET weight = ? WHERE course_id = ? AND clo_id = ? AND semester_id = ? AND section_id = ? AND year = ?",
            [weightValue, course_id, clo_id, semester_id, section_id, year]
          );

          results.success++;
          results.details.push({
            status: "updated",
            course_id,
            clo_id,
            weight: weightValue,
          });

          // console.log(`Updated weight for course_id=${course_id}, clo_id=${clo_id}: ${weightValue}`);
        } else {
          // เพิ่มข้อมูลใหม่
          await conn.query(
            "INSERT INTO course_clo (course_id, clo_id, semester_id, section_id, year, weight) VALUES (?, ?, ?, ?, ?, ?)",
            [course_id, clo_id, semester_id, section_id, year, weightValue]
          );

          results.success++;
          results.details.push({
            status: "inserted",
            course_id,
            clo_id,
            weight: weightValue,
          });

          // console.log(`Inserted new record with weight for course_id=${course_id}, clo_id=${clo_id}: ${weightValue}`);
        }
      } catch (err) {
        results.errors++;
        results.details.push({
          error: err.message,
          data: score,
        });
        console.error("Error processing individual score:", err);
      }
    }

    await conn.commit();
    conn.release();

    console.log(
      `Processed ${scores.length} records. Success: ${results.success}, Errors: ${results.errors}`
    );

    res.json({
      success: true,
      message: `Successfully processed ${results.success} out of ${scores.length} scores`,
      results,
    });
  } catch (error) {
    console.error("Error processing scores:", error);

    try {
      const conn = await pool.getConnection();
      await conn.rollback();
      conn.release();
    } catch (rollbackError) {
      console.error("Error during rollback:", rollbackError);
    }

    res.status(500).json({
      success: false,
      message: "Database error",
      error: error.message,
    });
  }
});

//นินิวเพิ่ม วันที่ 28 มีนาคม.
// API to get assignment details including CLOs and students
// API ดึงข้อมูล Assignment และรายชื่อนักเรียน
// API ดึงข้อมูล Assignment และรายชื่อนิสิต

// เปลี่ยนเป็นใช้ path parameter แทน query parameter
// แก้ไข API ให้ตรงกับโครงสร้างตาราง
// API สำหรับดึงข้อมูลนักเรียนและการบ้าน
app.get("/api/get_assignment_detail/:assignment_id", async (req, res) => {
  const { assignment_id } = req.params; // ใช้ req.params เพราะเป็น path parameter

  console.log("Assignment ID ที่ได้รับ:", assignment_id);

  // ตรวจสอบว่า assignment_id ถูกต้องหรือไม่
  if (!assignment_id || isNaN(assignment_id)) {
    return res
      .status(400)
      .json({ success: false, message: "กรุณาระบุรหัส Assignment ที่ถูกต้อง" });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // SQL ดึงข้อมูล Assignment
    const assignmentQuery = `
            SELECT
                a.assignment_id,
                a.assignment_name,
                a.course_name,
                a.section_id,
                a.semester_id,
                a.year,
                a.program_id,
                a.created_at
            FROM
                assignments a
            WHERE
                a.assignment_id = ?
        `;

    const assignments = await conn.query(assignmentQuery, [assignment_id]);
    console.log("ผลลัพธ์ SQL Assignment:", assignments);

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูล Assignment",
      });
    }

    const assignment = assignments[0];

    // SQL ดึงข้อมูล CLO พร้อมข้อมูลจากตาราง clo
    const cloQuery = `
            SELECT
                acs.id as assignment_clo_id,
                acs.clo_id,
                acs.score as max_score,
                acs.weight,
                c.CLO_code,
                c.CLO_name
            FROM
                assignment_clo_selection acs
            JOIN
                clo c ON acs.clo_id = c.CLO_id
            WHERE
                acs.assignment_id = ?
            ORDER BY
                c.CLO_code
        `;

    const clos = await conn.query(cloQuery, [assignment_id]);
    console.log("ผลลัพธ์ SQL CLO:", clos);

    const cloList = Array.isArray(clos) ? clos : clos ? [clos] : [];

    // ดึงข้อมูลนักเรียน
    const studentQuery = `
            SELECT DISTINCT
                astd.student_id,
                sd.name as student_name
            FROM
                assignments_students astd
            LEFT JOIN
                studentdata sd ON astd.student_id = sd.student_id
            WHERE
                astd.assignment_id = ?
            ORDER BY
                astd.student_id
        `;

    console.log("กำลังรัน SQL นักเรียนด้วย Assignment ID:", assignment_id);
    const students = await conn.query(studentQuery, [assignment_id]);
    console.log("ผลลัพธ์ SQL นักเรียน:", students);

    const studentList = Array.isArray(students)
      ? students
      : students
        ? [students]
        : [];
    console.log("จำนวนนักเรียนที่พบ:", studentList.length);

    // ดึงข้อมูลคะแนนที่บันทึกไว้
    const scoresQuery = `
            SELECT
                student_id,
                assignment_clo_id,
                score
            FROM
                student_assignment_scores
            WHERE
                assignment_id = ?
        `;

    const scoresResult = await conn.query(scoresQuery, [assignment_id]);
    console.log("ผลลัพธ์ SQL คะแนน:", scoresResult);

    // แปลงข้อมูลคะแนนเป็นรูปแบบที่ frontend ต้องการ
    const scoresMap = {};

    if (scoresResult && scoresResult.length > 0) {
      scoresResult.forEach((row) => {
        const { student_id, assignment_clo_id, score } = row;

        if (!scoresMap[student_id]) {
          scoresMap[student_id] = {};
        }

        scoresMap[student_id][assignment_clo_id] = parseFloat(score);
      });
    }

    console.log("ข้อมูลคะแนนที่จัดรูปแบบแล้ว:", scoresMap);

    // ส่งข้อมูลกลับไปยัง client
    res.json({
      success: true,
      assignment,
      clos: cloList,
      students: studentList,
      scores: scoresMap,
    });
  } catch (error) {
    console.error("Error fetching assignment details:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล Assignment",
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
});

// API Endpoint สำหรับบันทึกคะแนนนักศึกษา
// API Endpoint สำหรับบันทึกคะแนนนักศึกษา
app.post("/api/save_student_scores", async (req, res) => {
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
});

app.post("/program_course/excel", async (req, res) => {
  const coursesData = req.body;

  if (!Array.isArray(coursesData) || coursesData.length === 0) {
    return res.status(400).json({
      message: "No course data provided. Please upload valid Excel data.",
    });
  }

  try {
    const conn = await pool.getConnection();

    for (const course of coursesData) {
      const {
        program_id,
        course_id,
        course_name,
        course_engname,
        semester_id,
        year,
        section_id,
      } = course;

      // ตรวจสอบว่าข้อมูลในแต่ละรายการครบถ้วนหรือไม่
      if (!program_id || !course_id || !course_name || !semester_id || !year) {
        conn.release();
        return res.status(400).json({
          message:
            "Missing required fields in some rows. Please ensure all fields are complete.",
        });
      }

      // 1. ตรวจสอบว่ามีคอร์สในตาราง 'course' หรือไม่
      const checkCourseQuery = `
          SELECT 1 FROM course WHERE course_id = ?
        `;

      const courseResult = await conn.query(checkCourseQuery, [course_id]);
      const existingCourse = courseResult[0];

      // 2. ถ้าไม่มีคอร์ส ให้เพิ่มคอร์สใหม่ลงในตาราง 'course'
      if (!existingCourse || existingCourse.length === 0) {
        const insertCourseQuery = `
            INSERT INTO course (course_id, course_name, course_engname, timestamp)
            VALUES (?, ?, ?, NOW())
          `;

        await conn.query(insertCourseQuery, [
          course_id,
          course_name,
          course_engname,
        ]);
      } else {
        // หากมีคอร์สอยู่แล้ว อัปเดตข้อมูลคอร์ส
        const updateCourseQuery = `
            UPDATE course
            SET course_name = ?, course_engname = ?, timestamp = NOW()
            WHERE course_id = ?
          `;

        await conn.query(updateCourseQuery, [
          course_name,
          course_engname,
          course_id,
        ]);
      }

      // 3. ตรวจสอบว่ามี section_id ในตาราง 'section' หรือไม่
      const checkSectionQuery = `
          SELECT 1 FROM section WHERE section_id = ?
        `;

      const sectionResult = await conn.query(checkSectionQuery, [section_id]);
      const existingSection = sectionResult[0];

      // 4. ถ้าไม่มี section ให้เพิ่ม section ใหม่
      if (!existingSection || existingSection.length === 0) {
        const insertSectionQuery = `
              INSERT INTO section (section_id)
              VALUES (?)
            `;

        await conn.query(insertSectionQuery, [section_id]);
      }

      // 5. ตรวจสอบว่ามีความสัมพันธ์ในตาราง 'program_course' หรือไม่
      const checkProgramCourseQuery = `
          SELECT 1
          FROM program_course
          WHERE program_id = ? AND course_id = ? AND semester_id = ?
        `;

      const programCourseResult = await conn.query(checkProgramCourseQuery, [
        program_id,
        course_id,
        semester_id,
      ]);

      const existingProgramCourse = programCourseResult[0];

      // 6. ถ้าไม่มีความสัมพันธ์ ให้เพิ่มความสัมพันธ์ใหม่
      if (!existingProgramCourse || existingProgramCourse.length === 0) {
        const insertProgramCourseQuery = `
            INSERT INTO program_course (
              program_id, course_id, semester_id, year, section_id
            )
            VALUES (?, ?, ?, ?, ?)
          `;

        await conn.query(insertProgramCourseQuery, [
          program_id,
          course_id,
          semester_id,
          year,
          section_id,
        ]);
      } else {
        // หากมีความสัมพันธ์อยู่แล้ว อัปเดตข้อมูล
        const updateProgramCourseQuery = `
            UPDATE program_course
            SET year = ?, section_id = ?
            WHERE program_id = ? AND course_id = ? AND semester_id = ?
          `;

        await conn.query(updateProgramCourseQuery, [
          year,
          section_id,
          program_id,
          course_id,
          semester_id,
        ]);
      }
    }

    res
      .status(201)
      .json({ success: true, message: "All courses uploaded successfully!" });
    conn.release();
  } catch (err) {
    console.error("Error adding courses from Excel:", err);
    res.status(500).json({
      message: "Database error occurred while processing Excel data.",
      error: err.message,
    });
  }
});

// API to import scores from Excel
app.post("/api/import_scores_excel", async (req, res) => {
  const { assignment_id, scores_data } = req.body;

  if (
    !assignment_id ||
    !scores_data ||
    !Array.isArray(scores_data) ||
    scores_data.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Assignment ID and valid scores data are required",
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 1. Get CLO mapping for validation
    const cloQuery = `
            SELECT
                id as assignment_clo_id,
                clo_id
            FROM
                assignment_clo_selection
            WHERE
                assignment_id = ?
        `;

    const clos = await conn.query(cloQuery, [assignment_id]);

    if (!clos || clos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No CLOs found for this assignment",
      });
    }

    // Create mapping of CLO codes to IDs for lookup
    const validCloIds = new Set(clos.map((clo) => clo.assignment_clo_id));

    // 2. Process and validate each record from Excel
    const operations = [];
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Expected format for scores_data: [{ student_id, clo_data: { assignment_clo_id: score, ... } }, ...]
    for (const record of scores_data) {
      if (!record.student_id || !record.clo_data) {
        results.failed++;
        results.errors.push({
          student_id: record.student_id || "Unknown",
          error: "Missing student ID or CLO data",
        });
        continue;
      }

      for (const assignment_clo_id in record.clo_data) {
        // Skip if not a valid CLO for this assignment
        if (!validCloIds.has(parseInt(assignment_clo_id))) {
          results.failed++;
          results.errors.push({
            student_id: record.student_id,
            error: `Invalid CLO ID: ${assignment_clo_id}`,
          });
          continue;
        }

        const score = parseFloat(record.clo_data[assignment_clo_id]) || 0;

        // Ensure score is between 0 and 100
        const validScore = Math.min(Math.max(score, 0), 100);

        // Use INSERT ... ON DUPLICATE KEY UPDATE for upsert operation
        const query = `
                    INSERT INTO student_assignment_scores
                    (student_id, assignment_id, assignment_clo_id, score)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE score = ?
                `;

        operations.push(
          conn.query(query, [
            record.student_id,
            assignment_id,
            assignment_clo_id,
            validScore,
            validScore,
          ])
        );

        results.success++;
      }
    }

    // Execute all database operations
    await Promise.all(operations);

    await conn.commit();

    res.json({
      success: true,
      message: "Scores imported successfully",
      results,
    });
  } catch (error) {
    if (conn) await conn.rollback();

    console.error("Error importing scores from Excel:", error);
    res.status(500).json({
      success: false,
      message: "Error importing scores",
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
});

// API สำหรับเพิ่มนักศึกษาเข้าสู่ Assignment
// API สำหรับเพิ่มนักศึกษาหลายคนเข้าสู่ Assignment

app.post("/api/add_students_to_assignment", async (req, res) => {
  const { students } = req.body;

  // ตรวจสอบว่ามีข้อมูลนักศึกษาหรือไม่
  if (!students || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      success: false,
      message: "ไม่มีข้อมูลนักศึกษาที่จะบันทึก",
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const results = {
      success: [],
      errors: [],
    };

    for (const student of students) {
      try {
        // แสดงข้อมูลที่ได้รับจาก frontend เพื่อการตรวจสอบ
        console.log(`Processing student data:`, student);

        // บังคับอัพเดตข้อมูลนักศึกษาเสมอ ไม่ว่าจะมีอยู่แล้วหรือไม่
        const studentName = student.name || "Unknown";
        console.log(`Student ${student.student_id}, name: ${studentName}`);

        // ใช้ UPSERT เพื่อเพิ่มหรืออัพเดตข้อมูลนักศึกษา
        const upsertStudentQuery = `
                    INSERT INTO studentdata (student_id, name)
                    VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE name = VALUES(name)
                `;

        const upsertResult = await conn.query(upsertStudentQuery, [
          student.student_id,
          studentName,
        ]);

        console.log(`Upsert student result:`, upsertResult);

        // ขั้นตอนที่ 2: ดึง CLO IDs ทั้งหมดของ assignment นี้
        const getCloIdsQuery = `
                    SELECT id FROM assignment_clo_selection
                    WHERE assignment_id = ?
                `;

        const cloResults = await conn.query(getCloIdsQuery, [
          student.assignment_id,
        ]);
        console.log(
          `Found ${cloResults.length} CLOs for assignment ${student.assignment_id}`
        );

        if (!cloResults || cloResults.length === 0) {
          results.errors.push({
            student_id: student.student_id,
            assignment_id: student.assignment_id,
            error: `ไม่พบข้อมูล CLO สำหรับ assignment_id: ${student.assignment_id}`,
          });
          continue;
        }

        // ขั้นตอนที่ 3: เพิ่มนักศึกษาเข้า assignment_clo แต่ละรายการ
        const insertQuery = `
                    INSERT INTO assignments_students (
                        student_id,
                        assignment_id,
                        assignment_clo_id,
                        created_at
                    ) VALUES (?, ?, ?, NOW())
                `;

        let successCount = 0;

        // วนลูปเพื่อเพิ่มข้อมูลทีละ CLO
        for (const clo of cloResults) {
          try {
            console.log(
              `Inserting student_id=${student.student_id}, assignment_id=${student.assignment_id}, clo_id=${clo.id}`
            );

            const result = await conn.query(insertQuery, [
              student.student_id,
              student.assignment_id,
              clo.id,
            ]);

            console.log(`Insert result:`, result);
            successCount++;
          } catch (insertError) {
            console.error(
              `Error inserting CLO ${clo.id} for student ${student.student_id}:`,
              insertError
            );
          }
        }

        if (successCount > 0) {
          results.success.push({
            student_id: student.student_id,
            assignment_id: student.assignment_id,
            clos_added: successCount,
          });
        } else {
          results.errors.push({
            student_id: student.student_id,
            assignment_id: student.assignment_id,
            error: "ไม่สามารถเพิ่มข้อมูล CLO ใดๆ ได้",
          });
        }
      } catch (error) {
        console.error(`Error processing student ${student.student_id}:`, error);
        results.errors.push({
          student_id: student.student_id,
          assignment_id: student.assignment_id,
          error: error.message,
        });
      }
    }

    await conn.commit();

    res.status(200).json({
      success: true,
      message: `เพิ่มนักศึกษาสำเร็จ ${results.success.length} คน, ล้มเหลว ${results.errors.length} คน`,
      results: results,
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("Error adding students to assignment:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการเพิ่มนักศึกษา",
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
});

// API สำหรับดึงข้อมูลนักศึกษาใน Assignment
// app.get('/api/get_assignment_students/:assignment_id', async (req, res) => {
//     const { assignment_id } = req.params;

//     if (!assignment_id) {
//         return res.status(400).json({
//             success: false,
//             message: 'กรุณาระบุรหัส Assignment'
//         });
//     }

//     let conn;
//     try {
//         conn = await pool.getConnection();

//         const query = `
//             SELECT
//                 sa.id,
//                 sa.student_id,
//                 sa.student_name,
//                 sa.assignment_id,
//                 sa.assignment_name,
//                 sa.course_name,
//                 sa.year,
//                 sa.score,
//                 sa.status,
//                 sa.created_at
//             FROM
//                 student_assignments sa
//             WHERE
//                 sa.assignment_id = ?
//             ORDER BY
//                 sa.student_id
//         `;

//         const students = await conn.query(query, [assignment_id]);

//         const result = Array.isArray(students) ? students : [students];

//         res.json(result);

//     } catch (error) {
//         console.error('Error fetching assignment students:', error);
//         res.status(500).json({
//             success: false,
//             message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา'
//         });
//     } finally {
//         if (conn) conn.release();
//     }
// });

//     const { assignment_id } = req.query;  // ตรวจสอบพารามิเตอร์ assignment_id

//     // ตรวจสอบว่า assignment_id ถูกต้องหรือไม่
//     if (!assignment_id || isNaN(assignment_id)) {
//         return res.status(400).json({ error: 'Invalid or missing assignment_id' });
//     }

//     try {
//         const conn = await pool.getConnection();
//         const query = `
//             SELECT
//                 a.assignment_id,
//                 b.student_id,
//                 c.name,
//                 a.program,
//                 a.course_name,
//                 a.section_id,
//                 a.semester_id,
//                 a.year,
//                 a.assignment_name,
//                 a.created_at
//             FROM assignments a, assignments_students b, studentdata c
//             WHERE a.assignment_id = ? AND b.assignment_id = a.assignment_id AND b.student_id = c.student_id`;

//         const result = await conn.query(query, [assignment_id]);

//         res.json(result);
//         conn.release();
//     } catch (err) {
//         console.error("Error fetching assignment details:", err);
//         res.status(500).send({ message: "Internal Server Error", error: err.message });
//     }
// });

// นินิว
// API สำหรับดึงข้อมูลความสัมพันธ์ระหว่าง PLO และ CLO
// API สำหรับดึงข้อมูลความสัมพันธ์ระหว่าง PLO และ CLO
app.get("/clo_mapping", async (req, res) => {
  const { course_id, section_id, semester_id, year, program_id, clo_ids } =
    req.query;

  console.log("Received Query Params:", req.query);

  if (!course_id || !section_id || !semester_id || !year || !program_id) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    let query = `
            SELECT
      pc.plo_clo_id,
      pc.year,
      pc.weight,  -- ดึง weight จากตาราง plo_clo
      pc.semester_id,
      pc.course_id,
      pc.section_id,
      pc.PLO_id,
      pc.CLO_id,
      p.PLO_code,
      p.PLO_name,
      p.PLO_engname,
      c.CLO_code,
      c.CLO_name,
      c.CLO_engname
  FROM
      plo_clo pc  -- เปลี่ยนจาก course_plo เป็น plo_clo
  JOIN
      plo p ON pc.PLO_id = p.PLO_id
  JOIN
      clo c ON pc.CLO_id = c.CLO_id
  WHERE
      pc.course_id = ?
      AND pc.section_id = ?
      AND pc.semester_id = ?
      AND pc.year = ?
      AND pc.PLO_id IN (
          SELECT plo_id FROM program_plo WHERE program_id = ?
      )
          `;

    // ถ้ามีการระบุ clo_ids (ตัวเลือก)
    const params = [course_id, section_id, semester_id, year, program_id];
    if (clo_ids) {
      const cloIdsArray = clo_ids.split(",");
      if (cloIdsArray.length > 0) {
        query += ` AND cc.clo_id IN (${cloIdsArray.map(() => "?").join(",")})`;
        params.push(...cloIdsArray);
      }
    }

    query += ` ORDER BY p.PLO_code, c.CLO_code`;

    console.log("SQL Query:", query);
    console.log("Parameters:", params);

    const result = await conn.query(query, params);

    // ตรวจสอบและแปลงผลลัพธ์ให้เป็น array เสมอ
    const mappings = Array.isArray(result) ? result : result ? [result] : [];

    return res.status(200).json(mappings);
  } catch (err) {
    console.error("Error fetching PLO-CLO mappings:", err);
    return res
      .status(500)
      .json({ message: "Database error", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// เปลี่ยน '/plo_clo' (PATCH) เป็น '/clo_mapping_update'
app.patch("/clo_mapping_update", async (req, res) => {
  const {
    program_id,
    course_id,
    section_id,
    semester_id,
    year,
    PLO_id,
    CLO_id,
    weight,
  } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!course_id || !PLO_id || !CLO_id || weight === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: course_id, PLO_id, CLO_id, or weight",
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // 1. ค้นหาข้อมูลที่มีอยู่ใน course_plo ก่อน
    const checkQuery = `
            SELECT course_plo_id, weight
            FROM course_plo
            WHERE course_id = ? AND plo_id = ?
        `;
    const existingData = await conn.query(checkQuery, [course_id, PLO_id]);

    // แปลง weight เป็น int
    const weightInt = parseInt(weight) || 0;

    // 2. ถ้ามีข้อมูลอยู่แล้ว ให้อัปเดต
    if (existingData && existingData.length > 0) {
      const updateQuery = `
                UPDATE course_plo
                SET weight = ?
                WHERE course_id = ? AND plo_id = ?
            `;
      await conn.query(updateQuery, [weightInt, course_id, PLO_id]);
    } else {
      // 3. ถ้ายังไม่มีข้อมูล ให้เพิ่มใหม่
      const insertQuery = `
                INSERT INTO course_plo (course_id, plo_id, weight)
                VALUES (?, ?, ?)
            `;
      await conn.query(insertQuery, [course_id, PLO_id, weightInt]);
    }

    res.json({
      success: true,
      message: "Weight updated successfully",
    });
  } catch (error) {
    console.error("Error updating PLO-CLO weight:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    if (conn) conn.release();
  }
});

// เปลี่ยน '/plo_clo' (POST) เป็น '/clo_mapping_create'
app.post("/clo_mapping_create", async (req, res) => {
  const { program_id, course_id, section_id, semester_id, year, scores } =
    req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (
    !program_id ||
    !course_id ||
    !section_id ||
    !semester_id ||
    !year ||
    !scores ||
    !Array.isArray(scores) ||
    scores.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields or invalid scores array",
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // เริ่ม transaction
    await conn.beginTransaction();

    // ประมวลผลทีละรายการ
    for (const score of scores) {
      const { plo_id, clo_id, weight } = score;

      if (!plo_id || !clo_id || weight === undefined) {
        await conn.rollback();
        return res.status(400).json({
          success: false,
          message: `Invalid score data: missing plo_id, clo_id, or weight`,
        });
      }

      // แปลง weight เป็น int
      const weightInt = parseInt(weight) || 0;

      // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
      const checkQuery = `
                SELECT course_plo_id
                FROM course_plo
                WHERE course_id = ? AND plo_id = ?
            `;
      const existingData = await conn.query(checkQuery, [course_id, plo_id]);

      if (existingData && existingData.length > 0) {
        // อัพเดตข้อมูลที่มีอยู่
        const updateQuery = `
                    UPDATE course_plo
                    SET weight = ?
                    WHERE course_id = ? AND plo_id = ?
                `;
        await conn.query(updateQuery, [weightInt, course_id, plo_id]);
      } else {
        // เพิ่มข้อมูลใหม่
        const insertQuery = `
                    INSERT INTO course_plo (course_id, plo_id, weight)
                    VALUES (?, ?, ?)
                `;
        await conn.query(insertQuery, [course_id, plo_id, weightInt]);
      }
    }

    // Commit transaction
    await conn.commit();

    res.json({
      success: true,
      message: "PLO-CLO mappings added successfully",
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("Error adding PLO-CLO mappings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
});

// เปลี่ยน '/course_clo' เป็น '/assignment_clo'
app.get("/assignment_clo", async (req, res) => {
  const { program_id, course_id, semester_id, section_id, year } = req.query;

  if (!course_id || !semester_id || !section_id || !year) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    const query = `
            SELECT
                cc.course_clo_id,
                cc.course_id,
                cc.clo_id AS CLO_id,
                cc.semester_id,
                cc.section_id,
                cc.year,
                clo.CLO_code,
                clo.CLO_name,
                clo.CLO_engname,
                IFNULL(cp.weight, 0) AS weight
            FROM
                course_clo cc
            JOIN
                clo ON cc.clo_id = clo.CLO_id
            LEFT JOIN
                course_plo cp ON cc.course_id = cp.course_id AND cp.plo_id = (
                    SELECT plo_id FROM program_plo WHERE program_id = ? LIMIT 1
                )
            WHERE
                cc.course_id = ?
                AND cc.semester_id = ?
                AND cc.section_id = ?
                AND cc.year = ?
            ORDER BY clo.CLO_code
        `;

    const rows = await conn.query(query, [
      program_id,
      course_id,
      semester_id,
      section_id,
      year,
    ]);

    // บังคับให้ rows เป็น array
    let result = Array.isArray(rows) ? rows : [rows];

    if (result.length === 0) {
      return res.status(404).json({
        message: "No CLOs found for the selected course",
      });
    }

    // แปลงค่า BigInt เป็น String ก่อนส่งกลับ
    result = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.json(result);
  } catch (err) {
    console.error("Error fetching course CLOs:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// API route to search data in database
// http://localhost:8000/search?column=id&value=3
app.get("/search", async (req, res) => {
  const data = req.query;

  if (!data) {
    return res.status(400).json({ message: "No data" });
  }

  const keys = Object.keys(data);
  const values = Object.values(data);

  const whereClause = keys.map((col) => `${col} = ?`).join(" AND ");
  const query = `SELECT * FROM ${table} WHERE ${whereClause}`;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(query, values);
    res.status(200).json(result);
    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database searching failed",
    });
  }
});

// API route to delete data from database
// http://localhost:8000/delete?column=name&value=test2
app.delete("/delete", async (req, res) => {
  const data_select = req.query;

  if (!data_select) {
    return res.status(400).json({
      message: "No data to delete",
    });
  }

  const keys = Object.keys(data_select);
  const values = Object.values(data_select);

  const whereClause = keys.map((col) => `${col} = ?`).join(" AND ");
  const query = `DELETE FROM ${table} WHERE ${whereClause}`;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(query, values);
    res.status(200).json({
      message: "Data deletion succeeded",
      affectedRows: result.affectedRows,
    });
    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database deletion failed",
    });
  }
});

// API route to update data in database
// http://localhost:8000/update?column=id&value=1
app.put("/update", async (req, res) => {
  const data_select = req.query;
  const data_update = req.body;

  if (!data_select || !data_update) {
    return res.status(400).json({
      message: "No data provided",
    });
  }

  // Extract keys and values from the request data
  const keys_select = Object.keys(data_select);
  const values_select = Object.values(data_select);
  const keys_update = Object.keys(data_update);
  const values_update = Object.values(data_update);

  // Create Set clause
  const setClause = keys_update.map((key) => `${key} = ?`).join(", ");
  // Create WHERE clause
  const whereClause = keys_select.map((col) => `${col} = ?`).join(" AND ");
  // SQL query
  const query = `
        UPDATE ${table}
        SET ${setClause}
        WHERE ${whereClause}
    `;
  // Concatenate the values for the query parameters
  const values = [...values_update, ...values_select];

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(query, values);
    res.status(200).json({
      message: "Data updated successfully",
      affectedRows: result.affectedRows,
    });
    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database update failed",
      err,
    });
  }
});

// API route to handle login
// ในฟังก์ชัน /login
// app.post("/login", async (req, res) => {
//   const { email, token } = req.body;

//   try {
//     const conn = await pool.getConnection();

//     // ตรวจสอบว่าอีเมลมีอยู่ในฐานข้อมูลหรือไม่
//     const results = await conn.query("SELECT role FROM role WHERE email = ?", [
//       email,
//     ]);

//     let role;
//     if (results.length > 0) {
//       // ถ้าอีเมลมีอยู่ ดึงบทบาท (role)
//       role = results[0].role;
//     } else {
//       // ถ้าอีเมลไม่มีอยู่ เพิ่มผู้ใช้ใหม่ด้วยบทบาทเริ่มต้น
//       const defaultRole = "Student";
//       await conn.query("INSERT INTO role (email, role) VALUES (?, ?)", [
//         email,
//         defaultRole,
//       ]);
//       role = defaultRole;
//     }

//     // สร้าง JWT token ที่มีอายุยาวนาน
//     const jwtToken = jwt.sign(
//       { email, role },
//       "958902418959-llvaof6d4td6cicvdd27fltshv63rudo.apps.googleusercontent.com",
//       { expiresIn: "1d" }
//     );

//     // เก็บ JWT ใน cookie ที่มีอายุยาวนาน
//     res.cookie("auth_token", jwtToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000,
//       sameSite: "Strict",
//     });

//     // ส่งข้อมูลกลับไปยัง frontend รวมถึง token สำหรับเก็บใน localStorage
//     res.json({
//       success: true,
//       role,
//       token: jwtToken,
//     });

//     conn.release();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// เพิ่ม API endpoint สำหรับตรวจสอบสถานะการล็อกอิน
app.get("/verify-token", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      "958902418959-llvaof6d4td6cicvdd27fltshv63rudo.apps.googleusercontent.com"
    );

    // ถ้า token ยังไม่หมดอายุ ส่งข้อมูลผู้ใช้กลับไป
    res.json({ success: true, user: decoded });
  } catch (error) {
    // ถ้า token หมดอายุหรือไม่ถูกต้อง
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

// เพิ่ม API สำหรับการดึงข้อมูลโปรแกรม
//อ้อแก้ไข
app.get("/program", async (req, res) => {
  const { faculty_id } = req.query;

  try {
    const conn = await pool.getConnection();

    let query;
    let params = [];

    if (faculty_id) {
      query = `
                SELECT p.*
                FROM program p
                JOIN program_faculty pf ON p.program_id = pf.program_id
                WHERE pf.faculty_id = ?`;
      params = [faculty_id];
    } else {
      query = `SELECT * FROM program`;
    }

    const result = await conn.query(query, params);

    if (!result.length) {
      return res.json([]); // ✅ ถ้าไม่มีข้อมูล ให้ส่ง array ว่างแทน
    }

    res.json(result);
    conn.release();
  } catch (err) {
    console.error("Database error:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message }); // ✅ คืน JSON เสมอ
  }
});

// API สำหรับบันทึกข้อมูล Assignment พร้อมคะแนน CLO
//นินิว
app.post("/api/add_assignment", async (req, res) => {
  console.log("Received data:", req.body);

  const {
    program_id,
    course_name, // ตรงกับชื่อฟิลด์ในตาราง
    section_id,
    semester_id,
    year,
    assignment_name, // ตรงกับชื่อฟิลด์ในตาราง
    faculty_id, // จะแปลงเป็น major_id หรือไม่ใช้
    university_id,
    clo_scores, // อาจจะไม่มีในการเพิ่ม Assignment ใหม่
  } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น (ยกเว้น clo_scores)
  if (
    !program_id ||
    !course_name ||
    !section_id ||
    !semester_id ||
    !year ||
    !assignment_name
  ) {
    console.log("Missing required fields:", {
      program_id,
      course_name,
      section_id,
      semester_id,
      year,
      assignment_name,
    });
    return res.status(400).json({
      success: false,
      message: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // บันทึกข้อมูล Assignment ตามโครงสร้างตาราง
    const assignmentQuery = `
            INSERT INTO assignments (
                program_id,
                course_name,
                section_id,
                semester_id,
                year,
                assignment_name,
                faculty_id,
                university_id,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

    const assignmentResult = await conn.query(assignmentQuery, [
      program_id,
      course_name,
      section_id,
      semester_id,
      year,
      assignment_name,
      faculty_id, // ใช้ faculty_id แทน major_id (ถ้าเหมาะสม)
      university_id,
    ]);

    const assignmentId = assignmentResult.insertId;

    // บันทึกข้อมูลคะแนน CLO เฉพาะเมื่อมีข้อมูล
    if (clo_scores && clo_scores.length > 0) {
      // วนลูปสำหรับแต่ละ homework
      for (const hw of clo_scores) {
        const { homework_name, scores } = hw;

        // บันทึกข้อมูล homework
        const homeworkQuery = `
                    INSERT INTO assignment_homeworks (
                        assignment_id,
                        homework_name,
                        created_at
                    ) VALUES (?, ?, NOW())
                `;

        const homeworkResult = await conn.query(homeworkQuery, [
          assignmentId,
          homework_name,
        ]);

        const homeworkId = homeworkResult.insertId;

        // บันทึกคะแนนสำหรับแต่ละ CLO
        if (scores && scores.length > 0) {
          const scoresQuery = `
                        INSERT INTO homework_clo_scores (
                            homework_id,
                            clo_id,
                            score,
                            created_at
                        ) VALUES (?, ?, ?, NOW())
                    `;

          for (const score of scores) {
            await conn.query(scoresQuery, [
              homeworkId,
              score.clo_id,
              score.score,
            ]);
          }
        }
      }
    }

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Assignment บันทึกสำเร็จ",
      assignment_id: Number(assignmentId), // แปลง BigInt เป็น Number
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("Error creating assignment:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
});

// GET assignments for a specific course
app.get("/api/get_course_assignments", async (req, res) => {
  try {
    const { course_id, section_id, semester_id, year, program_id } = req.query;

    // Query to get all assignments for this course, section, semester, and year
    const query = `
        SELECT
          assignment_id,
          assignment_name,
          course_name,
          section_id,
          semester_id,
          year,
          created_at
        FROM assignments
        WHERE course_name = ?
        AND section_id = ?
        AND semester_id = ?
        AND year = ?
        AND program_id = ?
      `;

    const [assignments] = await pool.query(query, [
      course_id,
      section_id,
      semester_id,
      year,
      program_id,
    ]);

    res.json(assignments);
  } catch (error) {
    console.error("Error fetching course assignments:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

// เพิ่ม API สำหรับการดึง assignments
// API สำหรับดึงข้อมูล Assignment ทั้งหมด
app.get("/api/get_assignments", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const query = `
            SELECT
                a.assignment_id,
                a.assignment_name,
                a.section_id,
                a.semester_id,
                a.year,
                a.created_at,
                a.faculty_id,
                a.university_id
            FROM
                assignments a
            ORDER BY
                a.created_at DESC
        `;

    const assignments = await conn.query(query);

    // ตรวจสอบว่าผลลัพธ์เป็นอาร์เรย์หรือไม่
    const result = Array.isArray(assignments) ? assignments : [assignments];

    res.json(result);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
      error: error.message, // เพิ่ม error message เพื่อการ debug
    });
  } finally {
    if (conn) conn.release();
  }
});
// API สำหรับดึงข้อมูล Assignment และคะแนน CLO
app.get("/api/get_assignment/:id", async (req, res) => {
  const assignmentId = req.params.id;
  let conn;

  try {
    conn = await pool.getConnection();

    // ดึงข้อมูล assignment
    const assignmentQuery = `
            SELECT
                a.*,
                c.course_name,
                p.program_name
            FROM
                assignments a
            LEFT JOIN
                course c ON a.course_id = c.course_id
            LEFT JOIN
                program p ON a.program_id = p.program_id
            WHERE
                a.assignment_id = ?
        `;

    const assignments = await conn.query(assignmentQuery, [assignmentId]);

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูล Assignment",
      });
    }

    const assignment = assignments[0];

    // ดึงข้อมูล homework
    const homeworksQuery = `
            SELECT * FROM assignment_homeworks
            WHERE assignment_id = ?
        `;

    const homeworks = await conn.query(homeworksQuery, [assignmentId]);
    const homeworksList = Array.isArray(homeworks) ? homeworks : [homeworks];

    // ดึงข้อมูลคะแนน CLO สำหรับแต่ละ homework
    const homeworksWithScores = [];

    for (const homework of homeworksList) {
      const scoresQuery = `
                SELECT
                    hcs.*,
                    clo.CLO_code,
                    clo.CLO_name,
                    clo.CLO_engname,
                    cc.weight as clo_weight
                FROM
                    homework_clo_scores hcs
                JOIN
                    clo ON hcs.clo_id = clo.CLO_id
                JOIN
                    course_clo cc ON hcs.clo_id = cc.clo_id
                WHERE
                    hcs.homework_id = ?
                    AND cc.course_id = ?
                    AND cc.section_id = ?
                    AND cc.semester_id = ?
                    AND cc.year = ?
            `;

      const scores = await conn.query(scoresQuery, [
        homework.homework_id,
        assignment.course_id,
        assignment.section_id,
        assignment.semester_id,
        assignment.year,
      ]);

      const scoresList = Array.isArray(scores) ? scores : [scores];

      homeworksWithScores.push({
        ...homework,
        scores: scoresList,
      });
    }

    // รวมข้อมูลทั้งหมด
    const result = {
      ...assignment,
      homeworks: homeworksWithScores,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching assignment details:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
    });
  } finally {
    if (conn) conn.release();
  }
});

// API endpoint for updating a student's score
app.post("/api/update_student_score", async (req, res) => {
  const { assignment_id, student_id, score } = req.body;

  if (!assignment_id || !student_id || score === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const conn = await pool.getConnection();

    // Update score in assignments_students table
    const result = await conn.query(
      "UPDATE student_assignments SET score = ?, status = ? WHERE assignment_id = ? AND student_id = ?",
      [score, score >= 50 ? "Completed" : "Failed", assignment_id, student_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found in this assignment",
      });
    }

    res.json({
      success: true,
      message: "Score updated successfully",
    });

    conn.release();
  } catch (error) {
    console.error("Error updating student score:", error);
    res.status(500).json({
      success: false,
      message: "Error updating score",
    });
  }
});

app.get("/api/get_course_assignments", async (req, res) => {
  try {
    const {
      course_id,
      section_id,
      semester_id,
      year,
      program_id,
      assignment_name,
    } = req.query;

    const query = `
        SELECT
          assignment_id,
          assignment_name
        FROM assignments
        WHERE course_name = ?
        AND section_id = ?
        AND semester_id = ?
        AND year = ?
        AND program_id = ?
        AND assignment_name = ?
      `;

    const [assignments] = await pool.query(query, [
      course_id,
      section_id,
      semester_id,
      year,
      program_id,
      assignment_name,
    ]);

    res.json(assignments);
  } catch (error) {
    console.error("Error fetching course assignments:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

app.post("/program", async (req, res) => {
  let conn;
  try {
    const {
      program_name,
      program_name_th,
      year,
      program_shortname_en,
      program_shortname_th,
    } = req.body;

    console.log("Received payload:", req.body);

    // Validation checks
    const errors = [];

    if (!program_name || program_name.trim() === "") {
      errors.push("Program name (English) is required");
    }

    // Validate year
    let parsedYear = null;
    if (year !== null && year !== undefined) {
      parsedYear = Number(year);
      if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
        errors.push("Year must be a valid number between 1900 and 2100");
      }
    }

    // If validation errors exist, return error response
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    // Get a connection from the pool
    conn = await pool.getConnection();

    // SQL query
    const query = `
            INSERT INTO program
            (program_name, program_name_th, year, program_shortname_en, program_shortname_th)
            VALUES (?, ?, ?, ?, ?)
        `;

    // Execute query
    const result = await conn.query(query, [
      program_name,
      program_name_th,
      parsedYear, // Use the parsed year
      program_shortname_en,
      program_shortname_th,
    ]);

    // Send success response with inserted ID
    res.status(201).json({
      message: "Program added successfully",
      program_id: Number(result.insertId), // Explicitly convert to Number
    });
  } catch (err) {
    console.error("Full error details:", err);
    res.status(500).json({
      message: "Database error",
      error: err.message,
      fullError: err.toString(),
    });
  } finally {
    // Always release the connection back to the pool
    if (conn) conn.release();
  }
});

//อ้อแก้ไข
// เพิ่ม API สำหรับการแก้ไขข้อมูลโปรแกรม
app.put("/program/:program_id", async (req, res) => {
  const { program_id } = req.params;
  const {
    program_name,
    program_name_th,
    year,
    program_shortname_en,
    program_shortname_th,
  } = req.body;

  if (!program_name) {
    return res.status(400).json({ message: "Program name is required" });
  }
  if (!program_name_th) {
    return res.status(400).json({ message: "program_name_th is required" });
  }
  if (!year) {
    return res.status(400).json({ message: "year is required" });
  }
  if (!program_shortname_en) {
    return res
      .status(400)
      .json({ message: "program_shortname_en is required" });
  }
  if (!program_shortname_th) {
    return res
      .status(400)
      .json({ message: " program_shortname_th is required" });
  }

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "UPDATE program SET program_name = ?, program_name_th = ?, year = ?, program_shortname_en = ?, program_shortname_th = ? WHERE program_id = ?",
      [
        program_name,
        program_name_th,
        parseInt(year),
        program_shortname_en,
        program_shortname_th,
        program_id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.status(200).json({ message: "Program updated successfully" });
    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// เพิ่ม API สำหรับการลบข้อมูลโปรแกรม
app.delete("/program/:program_id", async (req, res) => {
  const { program_id } = req.params;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "DELETE FROM program WHERE program_id = ?",
      [program_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.status(200).json({ message: "Program deleted successfully" });
    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.get("/program_plo", async (req, res) => {
  const { program_id } = req.query; // รับ program_id จาก query string

  if (!program_id) {
    return res
      .status(400)
      .json({ success: false, message: "Program ID is required" });
  }

  try {
    const conn = await pool.getConnection(); // เชื่อมต่อกับฐานข้อมูล

    // ดึงข้อมูลจากตาราง program_plo โดยเชื่อมโยง program_id และ plo_id
    const programPlo = await conn.query(
      `SELECT pp.program_id, pp.plo_id, p.PLO_name, p.PLO_engname, p.PLO_code
             FROM program_plo pp
             JOIN plo p ON pp.plo_id = p.PLO_id
             WHERE pp.program_id = ?`,
      [program_id]
    );

    if (programPlo.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No PLOs found for the selected program",
      });
    }

    // ส่งข้อมูล PLOs ที่เกี่ยวข้องกับโปรแกรมกลับไป
    res.json({ success: true, message: programPlo });
    conn.release();
  } catch (err) {
    console.error("Error fetching program_plo:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post("/program_plo", async (req, res) => {
  const { program_id, plo_ids } = req.body;

  if (!program_id || !Array.isArray(plo_ids) || plo_ids.length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const conn = await pool.getConnection();
    const values = plo_ids.map((plo_id) => [program_id, plo_id]);
    await conn.query("INSERT INTO program_plo (program_id, plo_id) VALUES ?", [
      values,
    ]);
    res.status(201).json({ message: "Relationships added successfully" });
    conn.release();
  } catch (err) {
    console.error("Error adding relationships:", err);
    res.status(500).json({ message: "Database error" });
  }
});

app.delete("/program_plo", async (req, res) => {
  const { program_id, plo_id } = req.query;

  if (!program_id || !plo_id) {
    return res.status(400).json({ message: "Invalid data" });
  }

  console.log("Deleting PLO:", { program_id, plo_id }); // ตรวจสอบค่าที่ส่งมาจาก frontend

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "DELETE FROM program_plo WHERE program_id = ? AND plo_id = ?",
      [program_id, plo_id]
    );
    // ตรวจสอบผลลัพธ์จากการลบ
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ success: true, message: "PLO removed successfully" });
      console.log(result);
    } else {
      res.status(404).json({ message: "PLO not found" });
      console.log(result);
    }

    conn.release();
  } catch (err) {
    console.error("Error removing PLO:", err);
    res.status(500).json({ message: "Database error" });
    console.log("delete successed.");
  }
});

//อ้อแก้ไข
app.put("/program_plo", async (req, res) => {
  const { program_id, plo_id, PLO_name, PLO_engname, PLO_code } = req.body; // เพิ่ม PLO_code

  if (!program_id || !plo_id || !PLO_name || !PLO_engname) {
    return res.status(400).json({
      success: false,
      message:
        "Program ID, PLO ID, PLO name, and PLO English name are required",
    });
  }

  try {
    const conn = await pool.getConnection();

    // ตรวจสอบว่า PLO_id นี้มีอยู่ในตาราง plo หรือไม่
    const ploExists = await conn.query(
      "SELECT PLO_id FROM plo WHERE PLO_id = ?",
      [plo_id]
    );
    if (ploExists.length === 0) {
      return res.status(404).json({ success: false, message: "PLO not found" });
    }

    // อัปเดต PLO_name, PLO_engname และ PLO_code ในตาราง plo
    const result = await conn.query(
      `UPDATE plo
             SET PLO_name = ?, PLO_engname = ?, PLO_code = ?
             WHERE PLO_id = ?`,
      [PLO_name, PLO_engname, PLO_code, plo_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "PLO update failed" });
    }

    res.json({ success: true, message: "PLO updated successfully" });
    conn.release();
  } catch (err) {
    console.error("Error updating PLO:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// API route to get PLOs based on program
app.get("/plo", async (req, res) => {
  const { program_id } = req.query;

  if (!program_id) {
    return res
      .status(400)
      .json({ success: false, message: "Program ID is required" });
  }

  try {
    const conn = await pool.getConnection();
    const [plos] = await conn.query(
      `SELECT p.PLO_id, p.PLO_name, p.PLO_engname,  p.PLO_code
             FROM plo p
             INNER JOIN program_plo pp ON p.PLO_id = pp.PLO_id
             WHERE pp.program_id = ?`,
      [program_id]
    );

    // console.log(`Fetched PLOs for program_id ${program_id}:`, plos);

    res.json(plos);
    conn.release();
  } catch (err) {
    console.error("Error fetching PLOs:", err);
    res.status(500).send({ success: false, message: "Database error" });
  }
});

// API route to add PLO
app.post("/plo", async (req, res) => {
  const { PLO_name, PLO_engname, PLO_code, program_id } = req.body;

  // ตรวจสอบว่าข้อมูลครบถ้วน
  if (!PLO_name || !PLO_engname || !PLO_code || !program_id) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const conn = await pool.getConnection();

    // ตรวจสอบว่า program_id มีอยู่ในตาราง program
    const queryResult = await conn.query(
      "SELECT 1 FROM program WHERE program_id = ?",
      [program_id]
    );

    if (!queryResult || queryResult.length === 0) {
      conn.release();
      return res
        .status(400)
        .json({ success: false, message: "Invalid program_id" });
    }

    // เพิ่ม PLO ลงในตาราง `plo`
    const ploQuery =
      "INSERT INTO plo (PLO_name, PLO_engname, PLO_code) VALUES (?, ?, ?)";
    const ploResult = await conn.query(ploQuery, [
      PLO_name,
      PLO_engname,
      PLO_code,
    ]);
    console.log("PLO Insert Result:", ploResult);

    const newPloId = Number(ploResult.insertId); // แปลง BigInt เป็น Number

    // เพิ่มความสัมพันธ์ระหว่าง `program_id` และ `PLO_id` ในตาราง `program_plo`
    const programPloQuery =
      "INSERT INTO program_plo (program_id, PLO_id) VALUES (?, ?)";
    const programPloResult = await conn.query(programPloQuery, [
      program_id,
      newPloId,
    ]);

    conn.release();

    res.json({
      success: true,
      newPlo: {
        PLO_id: newPloId, // ส่งเป็น Number
        PLO_name,
        PLO_engname,
        PLO_code,
        program_id,
      },
    });
  } catch (err) {
    console.error("Error adding PLO:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post("/plo/excel", async (req, res) => {
  const rows = req.body;

  // ตรวจสอบว่าได้รับ array จาก client หรือไม่
  if (!Array.isArray(rows) || rows.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Data should be a non-empty array" });
  }

  try {
    const conn = await pool.getConnection();

    // วน loop เพิ่มข้อมูลทีละแถว
    for (const row of rows) {
      const { PLO_name, PLO_engname, PLO_code, program_id } = row;

      // ตรวจสอบว่าข้อมูลครบถ้วน
      if (!PLO_name || !PLO_engname || !PLO_code || !program_id) {
        conn.release();
        return res.status(400).json({
          success: false,
          message: `Missing required fields in one of the rows: ${JSON.stringify(row)}`,
        });
      }

      // ตรวจสอบว่า program_id มีอยู่
      const queryResult = await conn.query(
        "SELECT 1 FROM program WHERE program_id = ?",
        [program_id]
      );
      if (!queryResult || queryResult.length === 0) {
        conn.release();
        return res.status(400).json({
          success: false,
          message: `Invalid program_id in one of the rows: ${program_id}`,
        });
      }

      // เพิ่ม PLO ลงในตาราง `plo`
      const ploQuery =
        "INSERT INTO plo (PLO_name, PLO_engname, PLO_code) VALUES (?, ?, ?)";
      const ploResult = await conn.query(ploQuery, [
        PLO_name,
        PLO_engname,
        PLO_code,
      ]);
      const newPloId = Number(ploResult.insertId);

      // เพิ่มความสัมพันธ์ระหว่าง program_id และ PLO_id
      const programPloQuery =
        "INSERT INTO program_plo (program_id, PLO_id) VALUES (?, ?)";
      await conn.query(programPloQuery, [program_id, newPloId]);
    }

    conn.release();
    res.json({ success: true, message: "All rows inserted successfully" });
  } catch (err) {
    console.error("Error processing Excel upload:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post("/api/program/excel", async (req, res) => {
  const rows = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Data should be a non-empty array",
    });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    for (const row of rows) {
      const {
        code,
        program_name,
        program_name_th,
        program_shortname_en,
        program_shortname_th,
        year,
        faculty_id,
      } = row;

      if (
        !code ||
        !program_name ||
        !program_name_th ||
        !program_shortname_en ||
        !program_shortname_th ||
        !year ||
        !faculty_id
      ) {
        await conn.rollback();
        conn.release();
        return res.status(400).json({
          success: false,
          message: `Missing required fields in one of the rows: ${JSON.stringify(
            row
          )}`,
        });
      }

      // Try inserting into program table
      const programQuery = `
        INSERT INTO program (
          code, program_name, program_name_th, year, program_shortname_en, program_shortname_th
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      try {
        const result = await conn.query(programQuery, [
          code,
          program_name,
          program_name_th,
          year,
          program_shortname_en,
          program_shortname_th,
        ]);
        const program_id = result.insertId; // Get the auto-generated program_id

        // Now insert into program_faculty using program_id
        const pfQuery = `
          INSERT INTO program_faculty (program_id, faculty_id)
          VALUES (?, ?)
        `;
        await conn.query(pfQuery, [program_id, faculty_id]);
      } catch (error) {
        console.error("Error inserting into program:", error);
        await conn.rollback();
        conn.release();
        return res.status(500).json({
          success: false,
          message: "Database error inserting program",
          error: error.message,
        });
      }
    }

    await conn.commit();
    conn.release();
    res.json({ success: true, message: "All rows inserted successfully" });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("Error processing Excel upload:", err);
    res
      .status(500)
      .json({ success: false, message: "Database error", error: err.message });
  }
});

app.post("/api/course/excel", async (req, res) => {
  const rows = req.body;
  const { selectedYear, selectedSemester } = req.query;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Data should be a non-empty array",
    });
  }

  if (!selectedYear || !selectedSemester) {
    return res.status(400).json({
      success: false,
      message: "Year and semester are required",
    });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    for (const row of rows) {
      const {
        course_name,
        course_engname,
        section,
        program_id,
        course_id,
        year,
      } = row;

      const yearToUse = year || selectedYear;

      if (!course_name || !course_engname || !program_id || !yearToUse) {
        await conn.rollback();
        conn.release();
        return res.status(400).json({
          success: false,
          message: `Missing required fields in one of the rows: ${JSON.stringify(row)}`,
        });
      }

      let existingCourseId = course_id;

      const [courseRows] = await conn.query(
        "SELECT course_id FROM course WHERE course_id = ?",
        [course_id]
      );

      if (courseRows.length === 0) {
        const result = await conn.query(
          `INSERT INTO course (course_id, course_name, course_engname)
           VALUES (?, ?, ?)`,
          [course_id, course_name, course_engname]
        );
        console.log(`Inserted new course with ID: ${course_id}`);
      } else {
        console.log(`Course already exists with ID: ${course_id}`);
      }

      const [existingLink] = await conn.query(
        `SELECT * FROM program_course
         WHERE program_id = ? AND course_id = ? AND year = ? AND semester_id = ?`,
        [program_id, course_id, yearToUse, selectedSemester]
      );

      if (existingLink.length === 0) {
        await conn.query(
          `INSERT INTO program_course (program_id, course_id, year, semester_id, section_id)
           VALUES (?, ?, ?, ?, ?)`,
          [program_id, course_id, yearToUse, selectedSemester, section || 1]
        );
        console.log(
          `Linked course ${course_id} to program ${program_id} in ${yearToUse}/${selectedSemester}`
        );
      } else {
        console.log("Program-Course link already exists, skipping insert.");
      }
    }

    await conn.commit();
    conn.release();
    res.json({ success: true, message: "All rows inserted successfully" });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("Error processing Excel upload:", err);
    res.status(500).json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  }
});

app.get("/course", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT * FROM course");
    res.json(result);
    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching course");
  }
});

// Add a new course
app.post("/course", async (req, res) => {
  const { course_id, course_name, course_engname } = req.body;
  try {
    await pool.query(
      "INSERT INTO course (course_id, course_name, course_engname) VALUES (?, ?, ?)",
      [course_id, course_name, course_engname]
    );
    res.status(200).send("Course added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding course");
  }
});

// Update a course
app.put("/course/:course_id", async (req, res) => {
  const { course_id } = req.params;
  const { course_name, course_engname } = req.body;

  try {
    await pool.query(
      "UPDATE course SET course_name = ?, course_engname = ? WHERE course_id = ?",
      [course_name, course_engname, course_id]
    );
    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating course");
  }
});

// Delete a course
app.delete("/course/:course_id", async (req, res) => {
  const { course_id } = req.params;
  try {
    await pool.query("DELETE FROM course WHERE course_id = ?", [course_id]);
    res.status(200).send("Course deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting course");
  }
});

// Get courses by program ID
app.get("/program_course", async (req, res) => {
  const { program_id } = req.query;

  // ตรวจสอบว่า program_id ถูกส่งมาหรือไม่
  if (!program_id) {
    return res
      .status(400)
      .json({ success: false, message: "Program ID is required" });
  }

  // Query เพื่อดึงข้อมูลจากฐานข้อมูล
  const query = `
        SELECT
            pc.course_id,
            c.course_name,
            cp.weight
        FROM
            program_course pc
        JOIN
            course c ON pc.course_id = c.course_id
        LEFT JOIN
            course_plo cp ON pc.course_id = cp.course_id
        WHERE
            pc.program_id = ?
    `;

  try {
    // ใช้ pool เพื่อเชื่อมต่อและ query ข้อมูล
    const connection = await pool.getConnection();
    const results = await connection.query(query, [program_id]);

    // ส่งผลลัพธ์กลับไปยัง client
    res.json({ success: true, courses: results });

    // ปล่อย connection กลับไปยัง pool
    connection.release();
  } catch (err) {
    console.error("Error fetching program courses:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post("/program_course", async (req, res) => {
  const {
    year,
    semester_id,
    course_id,
    course_name,
    course_engname,
    section_id,
    program_id,
  } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (
    !year ||
    !semester_id ||
    !course_id ||
    !course_name ||
    !course_engname ||
    !section_id ||
    !program_id
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required information." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // ตรวจสอบว่า course_id มีอยู่ในตาราง course หรือไม่
    const [courseCheck] = await connection.query(
      "SELECT * FROM course WHERE course_id = ?",
      [course_id]
    );

    if (!courseCheck || courseCheck.length === 0) {
      // ถ้าไม่มี course_id ในตาราง course, ให้เพิ่มข้อมูลใหม่
      await connection.query(
        "INSERT INTO course (course_id, course_name, course_engname) VALUES (?, ?, ?)",
        [course_id, course_name, course_engname]
      );
    }

    // ตรวจสอบว่า semester_id มีอยู่ในตาราง semester หรือไม่
    const [semesterCheck] = await connection.query(
      "SELECT * FROM semester WHERE semester_id = ?",
      [semester_id]
    );

    if (!semesterCheck || semesterCheck.length === 0) {
      throw new Error(`Semester ID ${semester_id} does not exist.`);
    }

    // ตรวจสอบว่า section_id มีอยู่ในตาราง section หรือไม่
    const [sectionCheck] = await connection.query(
      "SELECT * FROM section WHERE section_id = ?",
      [section_id]
    );

    if (!sectionCheck || sectionCheck.length === 0) {
      // ถ้าไม่มี section_id ในตาราง section, ให้เพิ่มข้อมูลใหม่
      await connection.query(
        "INSERT INTO section (section_id) VALUES (?)",
        [section_id] // เพิ่มข้อมูล section_id ที่จำเป็น
      );
    }

    // เพิ่มข้อมูลลงในตาราง program_course
    const result = await connection.query(
      "INSERT INTO program_course (year, semester_id, course_id, section_id, program_id) VALUES (?, ?, ?, ?, ?)",
      [year, semester_id, course_id, section_id, program_id]
    );

    // Commit ข้อมูล
    await connection.commit();

    // แปลง BigInt เป็น String ก่อนส่งกลับ
    const programCourseId = result.insertId.toString();

    res.status(201).json({
      message: "Data added successfully",
      data: {
        program_course_id: programCourseId, // เปลี่ยน BigInt เป็น String
        year,
        semester_id,
        course_id,
        course_name,
        course_engname,
        section_id,
        program_id,
      },
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error adding program_course:", err.message);
    res.status(500).json({
      message: "An error occurred while adding the data.",
      error: err.message,
    });
  } finally {
    connection.release();
  }
});

// Route for deleting a course based on program_id, semester_id, and course_id
app.delete("/program_course", async (req, res) => {
  const { program_id, semester_id, course_id } = req.query; // รับค่าจาก query parameters

  // ตรวจสอบว่าค่าที่จำเป็นถูกส่งมาครบหรือไม่
  if (!program_id || !semester_id || !course_id) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    // สร้าง Connection จาก Pool
    const conn = await pool.getConnection();

    // SQL Query สำหรับการลบข้อมูล
    const deleteQuery = `
            DELETE FROM program_course
            WHERE program_id = ? AND semester_id = ? AND course_id = ?
        `;

    // Execute SQL Query
    const result = await conn.query(deleteQuery, [
      program_id,
      semester_id,
      course_id,
    ]);
    conn.release(); // ปิดการเชื่อมต่อ

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Course deleted successfully" });
    } else {
      res.status(404).json({ message: "Course not found or already deleted" });
    }
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/program_course/:course_id", async (req, res) => {
  const { course_id } = req.params;
  const updateFields = req.body;

  // Validate that at least one update field is provided
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No update fields provided" });
  }

  // Define allowed fields for update
  const allowedFields = [
    "course_name",
    "course_engname",
    "new_course_id",
    "program_id",
    "semester_id",
  ];

  // Check if any unexpected fields are being updated
  const invalidFields = Object.keys(updateFields).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: `Invalid update fields: ${invalidFields.join(", ")}`,
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Dynamic update logic
    const updateOperations = [];
    const updateValues = [];

    // Construct dynamic update query
    if (updateFields.course_name) {
      updateOperations.push("course_name = ?");
      updateValues.push(updateFields.course_name);
    }

    if (updateFields.course_engname) {
      updateOperations.push("course_engname = ?");
      updateValues.push(updateFields.course_engname);
    }

    // If new course ID is provided, handle it separately
    if (updateFields.new_course_id) {
      // Check if new course ID exists
      const [existingNewCourse] = await conn.query(
        "SELECT * FROM course WHERE course_id = ?",
        [updateFields.new_course_id]
      );

      if (!existingNewCourse) {
        // Insert new course if it doesn't exist
        await conn.query(
          "INSERT INTO course (course_id, course_name, course_engname) VALUES (?, ?, ?)",
          [
            updateFields.new_course_id,
            updateFields.course_name || "",
            updateFields.course_engname || "",
          ]
        );
      }

      // Update related tables with new course ID
      await conn.query(
        "UPDATE program_course SET course_id = ? WHERE course_id = ?",
        [updateFields.new_course_id, course_id]
      );
      await conn.query(
        "UPDATE course_plo SET course_id = ? WHERE course_id = ?",
        [updateFields.new_course_id, course_id]
      );
      await conn.query("UPDATE plo_clo SET course_id = ? WHERE course_id = ?", [
        updateFields.new_course_id,
        course_id,
      ]);
      await conn.query(
        "UPDATE course_clo SET course_id = ? WHERE course_id = ?",
        [updateFields.new_course_id, course_id]
      );
    }

    // Perform update for course table
    if (updateOperations.length > 0) {
      const updateQuery = `UPDATE course
                SET ${updateOperations.join(", ")}
                WHERE course_id = ?`;

      updateValues.push(updateFields.new_course_id || course_id);

      await conn.query(updateQuery, updateValues);
    }

    await conn.commit();
    res.status(200).json({
      message: "Course updated successfully.",
      updatedFields: Object.keys(updateFields),
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("Error updating program_course:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  } finally {
    if (conn) conn.release();
  }
});

// Get Groups and Sections based on Course ID and Semester
// API ที่ดึงข้อมูล Section โดยระบุ Course ID และ Semester ID
//อ้อแก้
app.get("/section", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT section_id FROM section"); // ❌ ใช้ result ตรง ๆ
    conn.release();

    console.log("✅ Raw data from MySQL:", JSON.stringify(result, null, 2)); // ✅ Debug ดูค่า MySQL ส่งมา

    if (!Array.isArray(result)) {
      return res
        .status(500)
        .json({ message: "Database query did not return an array" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No sections found" });
    }

    res.status(200).json(result); // ✅ ส่ง Array เสมอ
  } catch (err) {
    console.error("❌ Error fetching sections:", err);
    res
      .status(500)
      .json({ message: "Error fetching sections", error: err.message });
  }
});

// Get Semesters
app.get("/semesters", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT semester_id, semester_name FROM semester"
    );

    // ตรวจสอบว่ามีข้อมูลไหม
    if (result.length === 0) {
      return res.status(404).json({ message: "No semesters found" });
    }

    // แสดงข้อมูลทั้งหมดที่ได้จากฐานข้อมูล
    // console.log(result); // ตรวจสอบผลลัพธ์ที่ได้จากฐานข้อมูล
    res.status(200).json(result); // ส่งผลลัพธ์ทั้งหมดกลับไปยัง client
    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching semester" });
  }
});

// API route to get years from program_course
app.get("/year", async (req, res) => {
  const { program_id } = req.query;

  if (!program_id) {
    return res.status(400).json({ message: "Program ID is required" });
  }

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT DISTINCT year FROM program_course WHERE program_id = ? ORDER BY year ASC",
      [program_id]
    );
    res.status(200).json(result);
    conn.release();
  } catch (err) {
    console.error("Error fetching years:", err);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/course_clo", async (req, res) => {
  const { course_id, clo_id, semester_id, section_id } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO course_clo (course_id, clo_id, semester_id, section_id) VALUES (?, ?, ?, ?)",
      [course_id, clo_id, semester_id, section_id]
    );
    res.status(201).json({ message: "Course CLO added successfully" });
    conn.release();
  } catch (err) {
    console.error("Error inserting course CLO:", err);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/course_clo", async (req, res) => {
  const { program_id, course_id, semester_id, section_id, year } = req.query;

  if (!program_id || !course_id || !semester_id || !section_id || !year) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    const query = `
            SELECT
                course_clo.course_clo_id,
                course_clo.course_id,
                course_clo.semester_id,
                course_clo.section_id,
                course_clo.year,
                clo.CLO_id,
                clo.CLO_code,
                clo.CLO_name,
                clo.CLO_engname,
                clo.timestamp,
                course.course_name,
                course.course_engname
            FROM
                program_course pc
            JOIN
                course_clo ON pc.course_id = course_clo.course_id
                AND pc.semester_id = course_clo.semester_id
                AND pc.section_id = course_clo.section_id
                AND pc.year = course_clo.year
            JOIN
                clo ON course_clo.clo_id = clo.CLO_id
            JOIN
                course ON course_clo.course_id = course.course_id
            WHERE
                pc.program_id = ?
                AND course_clo.course_id = ?
                AND course_clo.semester_id = ?
                AND course_clo.section_id = ?
                AND course_clo.year = (?-1)
        `;

    const rows = await conn.query(query, [
      program_id,
      course_id,
      semester_id,
      section_id,
      year,
    ]);

    // บังคับให้ rows เป็น array
    const result = Array.isArray(rows) ? rows : [rows];

    res.json(result);
  } catch (err) {
    console.error("Error fetching course CLOs:", err);
    res.status(500).json({ message: "Database error" });
  } finally {
    if (conn) conn.release();
  }
});

app.put("/course_clo", async (req, res) => {
  const {
    program_id,
    course_id,
    clo_id,
    semester_id,
    section_id,
    year,
    CLO_name,
    CLO_engname,
    CLO_code,
  } = req.body;

  if (
    !program_id ||
    !course_id ||
    !clo_id ||
    !semester_id ||
    !section_id ||
    !year ||
    !CLO_name ||
    !CLO_engname ||
    !CLO_code
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Log query parameters
    console.log(
      "Checking program_course with parameters:",
      program_id,
      course_id,
      semester_id,
      section_id,
      year
    );

    // Check if the combination exists in program_course
    const [programCourseCheck] = await conn.query(
      `
            SELECT * FROM program_course
            WHERE program_id = ? AND course_id = ? AND semester_id = ? AND section_id = ? AND year = ?
        `,
      [program_id, course_id, semester_id, section_id, year]
    );

    console.log("Program course check result:", programCourseCheck);

    if (!programCourseCheck || programCourseCheck.length === 0) {
      return res.status(404).json({ message: "Program Course not found" });
    }

    // Log query parameters for course_clo check
    console.log(
      "Checking course_clo with parameters:",
      course_id,
      clo_id,
      semester_id,
      section_id,
      year
    );

    // Check if the given course_clo exists
    const [courseCloCheck] = await conn.query(
      `
            SELECT * FROM course_clo
            WHERE course_id = ? AND clo_id = ? AND semester_id = ? AND section_id = ? AND year = ?
        `,
      [course_id, clo_id, semester_id, section_id, year]
    );

    console.log("Course CLO check result:", courseCloCheck);

    if (!courseCloCheck || courseCloCheck.length === 0) {
      return res.status(404).json({ message: "Course CLO not found" });
    }

    // Update the course_clo table with the new details
    await conn.query(
      `
            UPDATE course_clo
            SET clo_id = ?, semester_id = ?, section_id = ?, year = ?
            WHERE course_id = ? AND clo_id = ? AND semester_id = ? AND section_id = ? AND year = ?
        `,
      [
        clo_id,
        semester_id,
        section_id,
        year,
        course_id,
        clo_id,
        semester_id,
        section_id,
        year,
      ]
    );

    // Update CLO_name, CLO_engname, AND CLO_code in the clo table
    await conn.query(
      `
            UPDATE clo
            SET CLO_name = ?, CLO_engname = ?, CLO_code = ?
            WHERE CLO_id = ?
        `,
      [CLO_name, CLO_engname, CLO_code, clo_id]
    );

    await conn.commit();
    res.status(200).json({ message: "Course CLO updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("Error updating course CLO:", err);
    res.status(500).json({ message: "Database error" });
  } finally {
    conn.release();
  }
});

app.delete("/course_clo", async (req, res) => {
  const { clo_id, course_id, semester_id, section_id, year, program_id } =
    req.body;

  // ตรวจสอบว่าค่าที่จำเป็นถูกส่งมาหรือไม่
  if (
    !program_id ||
    !clo_id ||
    !course_id ||
    !semester_id ||
    !section_id ||
    !year
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // ตรวจสอบความสัมพันธ์ระหว่าง program_id และ course_clo ผ่าน program_course
    console.log("Checking relationship between program_id and course_clo:", {
      program_id,
      clo_id,
      course_id,
      semester_id,
      section_id,
      year,
    });

    const programCourseCheck = await conn.query(
      `
            SELECT * FROM program_course
            WHERE program_id = ? AND course_id = ? AND semester_id = ? AND section_id = ? AND year = ?
        `,
      [program_id, course_id, semester_id, section_id, year]
    );

    console.log("Program course relationship found:", programCourseCheck);

    if (programCourseCheck.length === 0) {
      return res
        .status(404)
        .json({ message: "Program Course relationship not found" });
    }

    // ลบ CLO จากตาราง course_clo
    const deleteCourseCloResult = await conn.query(
      `
            DELETE FROM course_clo
            WHERE clo_id = ? AND course_id = ? AND semester_id = ? AND section_id = ? AND year = ?
        `,
      [clo_id, course_id, semester_id, section_id, year]
    );

    console.log("Delete result from course_clo:", deleteCourseCloResult);

    // ตรวจสอบผลลัพธ์จากคำสั่ง DELETE
    if (deleteCourseCloResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Course CLO not found or not deleted" });
    }

    // ตรวจสอบว่ามีการใช้งาน clo_id ในตาราง course_clo ที่อื่นหรือไม่
    const cloUsageCheck = await conn.query(
      `
            SELECT COUNT(*) AS count FROM course_clo WHERE clo_id = ?
        `,
      [clo_id]
    );

    console.log("CLO usage check result:", cloUsageCheck);

    if (cloUsageCheck[0].count === 0) {
      const deleteCloResult = await conn.query(
        `
                DELETE FROM clo WHERE clo_id = ?
            `,
        [clo_id]
      );
      console.log("Deleted from clo:", deleteCloResult);
    }

    await conn.commit();
    res.status(200).json({ message: "Course CLO deleted successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("Error deleting course CLO:", err);
    res.status(500).json({ message: "Database error" });
  } finally {
    conn.release();
  }
});

app.post("/program_course_clo", async (req, res) => {
  const {
    program_id,
    course_id,
    semester_id,
    section_id,
    year,
    CLO_code,
    CLO_name,
    CLO_engname,
  } = req.body;

  if (
    !program_id ||
    !course_id ||
    !semester_id ||
    !section_id ||
    !year ||
    !CLO_code ||
    !CLO_name ||
    !CLO_engname
  ) {
    return res.status(400).json({
      message:
        "Missing required fields. Please select all necessary options and provide CLO details.",
    });
  }

  try {
    const conn = await pool.getConnection();

    // ตรวจสอบว่าข้อมูล program, course, semester, section, และ year มีอยู่หรือไม่
    const checkQuery = `
            SELECT 1
            FROM program_course
            WHERE
                program_id = ?
                AND course_id = ?
                AND semester_id = ?
                AND section_id = ?
                AND year = ?
        `;
    const [existingProgramCourse] = await conn.query(checkQuery, [
      program_id,
      course_id,
      semester_id,
      section_id,
      year,
    ]);

    if (existingProgramCourse.length === 0) {
      conn.release();
      return res.status(400).json({
        message:
          "The selected program, course, semester, section, or year does not exist.",
      });
    }

    // เพิ่ม CLO ใหม่
    const insertCLOQuery = `
            INSERT INTO clo (CLO_code, CLO_name, CLO_engname, timestamp)
            VALUES (?, ?, ?, NOW())
        `;
    const cloResult = await conn.query(insertCLOQuery, [
      CLO_code,
      CLO_name,
      CLO_engname,
    ]);

    // ดึง clo_id ที่เพิ่มมาใหม่
    const clo_id = cloResult.insertId;

    // เพิ่มข้อมูลลงในตาราง course_clo
    const insertCourseCLOQuery = `
            INSERT INTO course_clo (course_id, semester_id, section_id, year, clo_id)
            VALUES (?, ?, ?, ?, ?)
        `;
    await conn.query(insertCourseCLOQuery, [
      course_id,
      semester_id,
      section_id,
      year,
      clo_id,
    ]);

    res
      .status(201)
      .json({ message: "CLO added successfully!", clo_id: Number(clo_id) }); // แปลง BigInt เป็น Number
    conn.release();
  } catch (err) {
    console.error("Error adding CLO:", err);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/program_course_clo/excel", async (req, res) => {
  const cloDataArray = req.body; // รับข้อมูลเป็น array

  if (!Array.isArray(cloDataArray) || cloDataArray.length === 0) {
    return res.status(400).json({
      message: "No CLO data provided. Please upload valid Excel data.",
    });
  }

  try {
    const conn = await pool.getConnection();

    for (const cloData of cloDataArray) {
      const {
        program_id,
        course_id,
        semester_id,
        section_id,
        year,
        CLO_code,
        CLO_name,
        CLO_engname,
      } = cloData;

      // ตรวจสอบว่าข้อมูลในแต่ละรายการครบถ้วนหรือไม่
      if (
        !program_id ||
        !course_id ||
        !semester_id ||
        !section_id ||
        !year ||
        !CLO_code ||
        !CLO_name ||
        !CLO_engname
      ) {
        return res.status(400).json({
          message:
            "Missing required fields in some rows. Please ensure all fields are complete.",
        });
      }

      // ตรวจสอบว่ามี program, course, semester, section, year หรือไม่
      const checkQuery = `
                SELECT 1
                FROM program_course
                WHERE
                    program_id = ?
                    AND course_id = ?
                    AND semester_id = ?
                    AND section_id = ?
                    AND year = ?
            `;
      const [existingProgramCourse] = await conn.query(checkQuery, [
        program_id,
        course_id,
        semester_id,
        section_id,
        year,
      ]);

      if (existingProgramCourse.length === 0) {
        conn.release();
        return res.status(400).json({
          message: `The program, course, semester, section, or year does not exist for CLO_code: ${CLO_code}`,
        });
      }

      // เพิ่ม CLO ลงในตาราง `clo`
      const insertCLOQuery = `
                INSERT INTO clo (CLO_code, CLO_name, CLO_engname, timestamp)
                VALUES (?, ?, ?, NOW())
            `;
      const cloResult = await conn.query(insertCLOQuery, [
        CLO_code,
        CLO_name,
        CLO_engname,
      ]);

      // ดึง clo_id ที่เพิ่มใหม่
      const clo_id = cloResult.insertId;

      // เพิ่มข้อมูลใน `course_clo`
      const insertCourseCLOQuery = `
                INSERT INTO course_clo (course_id, semester_id, section_id, year, clo_id)
                VALUES (?, ?, ?, ?, ?)
            `;
      await conn.query(insertCourseCLOQuery, [
        course_id,
        semester_id,
        section_id,
        year,
        clo_id,
      ]);
    }

    res.status(201).json({ message: "All CLOs added successfully!" });
    conn.release();
  } catch (err) {
    console.error("Error adding CLOs from Excel:", err);
    res.status(500).json({
      message: "Database error occurred while processing Excel data.",
    });
  }
});

// app.delete('/course_clo/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const conn = await pool.getConnection();
//         const result = await conn.query('DELETE FROM course_clo WHERE course_clo_id = ?', [id]);
//         res.status(200).json({ message: 'Course CLO deleted successfully', affectedRows: result.affectedRows });
//         conn.release();
//     } catch (err) {
//         console.error('Error deleting course CLO:', err);
//         res.status(500).json({ message: 'Database error' });
//     }
// });

app.get("/course_plo", async (req, res) => {
  const { program_id, year } = req.query;

  if (!program_id || !year) {
    return res
      .status(400)
      .json({ success: false, message: "Program ID and year are required" });
  }

  try {
    const query = `
            SELECT cp.course_id, cp.plo_id, cp.weight, c.course_name, p.PLO_code
            FROM course_plo cp
            JOIN course c ON cp.course_id = c.course_id
            JOIN plo p ON cp.plo_id = p.plo_id
            JOIN program_plo pp ON p.plo_id = pp.plo_id
            JOIN program pr ON pp.program_id = pr.program_id
            WHERE pr.program_id = ? AND pr.year = ?
        `;

    const conn = await pool.getConnection();
    const rows = await conn.query(query, [program_id, year]);
    conn.release();

    console.log(
      `Retrieved ${rows.length} course-PLO mappings for program ${program_id} in year ${year}`
    );

    res.json({ success: true, message: rows });
  } catch (error) {
    console.error("Error fetching course-PLO mappings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/course_plo", async (req, res) => {
  const { program_id, scores } = req.body;

  if (!program_id || !scores || !Array.isArray(scores)) {
    return res.status(400).json({
      success: false,
      message: "Missing program_id or scores array.",
    });
  }

  try {
    const conn = await pool.getConnection();

    // ดึง PLO IDs จาก scores
    const ploIds = scores.map((score) => score.plo_id);
    console.log("PLO IDs to check:", ploIds);

    // สร้าง query แบบ dynamic
    const ploIdsString = ploIds.join(",");
    const query = `
            SELECT plo_id FROM program_plo
            WHERE program_id = ${program_id} AND plo_id IN (${ploIdsString})
        `;

    // เรียก query
    const rawResult = await conn.query(query);
    console.log("Raw validPloRows:", rawResult);

    // ตรวจสอบผลลัพธ์
    const validPloRows = Array.isArray(rawResult) ? rawResult : [rawResult];
    if (validPloRows.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        message: "No valid PLOs found for the provided program_id.",
      });
    }

    // Map plo_id ที่ valid
    const validPloIds = validPloRows.map((row) => row.plo_id);
    console.log("Valid PLO IDs:", validPloIds);

    // กรองเฉพาะข้อมูลที่ valid
    const values = scores
      .filter((score) => validPloIds.includes(score.plo_id))
      .map((score) => `(${score.course_id}, ${score.plo_id}, ${score.weight})`);

    console.log("Values to insert:", values);

    if (values.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        message: "No valid scores to add.",
      });
    }

    // Insert ข้อมูลหลายแถว
    const insertQuery = `
            INSERT INTO course_plo (course_id, plo_id, weight)
            VALUES ${values.join(",")}
        `;
    console.log("Generated query:", insertQuery);

    const result = await conn.query(insertQuery);
    conn.release();

    // ใช้ safeJsonStringify
    const safeJsonStringify = (data) => {
      return JSON.stringify(data, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
    };

    res.send(
      safeJsonStringify({
        success: true,
        message: "New mappings added successfully.",
        result: {
          affectedRows: result.affectedRows,
          insertId: result.insertId, // BigInt จะถูกแปลง
          warningStatus: result.warningStatus,
        },
      })
    );
  } catch (error) {
    console.error("Error adding course-PLO mappings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

// Update course-PLO mapping
app.patch("/course_plo", async (req, res) => {
  const { program_id, course_id, plo_id, weight } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!program_id || !course_id || !plo_id || weight === undefined) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: program_id, course_id, plo_id, or weight.",
    });
  }

  try {
    const conn = await pool.getConnection();

    // ตรวจสอบข้อมูลปัจจุบัน
    const queryCheck = `
            SELECT weight
            FROM course_plo
            WHERE course_id = ? AND plo_id = ?
        `;
    const [currentWeight] = await conn.query(queryCheck, [course_id, plo_id]);

    // หาก weight ไม่เปลี่ยนแปลงให้ส่งข้อความกลับ
    if (currentWeight.length > 0 && currentWeight[0].weight === weight) {
      conn.release();
      return res.status(400).json({
        success: false,
        message: "The weight value is already the same as the current one.",
      });
    }

    // อัปเดตเฉพาะค่า weight
    const queryUpdate = `
            UPDATE course_plo
            SET weight = ?
            WHERE course_id = ? AND plo_id = ?
        `;
    const result = await conn.query(queryUpdate, [weight, course_id, plo_id]);

    conn.release();

    // แปลงค่า BigInt ให้เป็น String ก่อนที่จะส่งค่าผ่าน JSON
    const serializedResult = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.json({
      success: true,
      message: "Weight updated successfully.",
      result: serializedResult,
    });
  } catch (error) {
    console.error("Error updating weight:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

app.get("/course_clo_with_weight", async (req, res) => {
  const { program_id, course_id, semester_id, section_id, year } = req.query;

  if (!program_id || !course_id || !semester_id || !section_id || !year) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const query = `
        SELECT
          course_clo.course_clo_id,
          course_clo.course_id,
          course_clo.semester_id,
          course_clo.section_id,
          course_clo.year,
          course_clo.weight,   /* เพิ่มการดึงค่า weight จากตาราง course_clo */
          clo.CLO_id,
          clo.CLO_code,
          clo.CLO_name,
          clo.CLO_engname,
          clo.timestamp,
          course.course_name,
          course.course_engname
        FROM
          program_course pc
        JOIN
          course_clo ON pc.course_id = course_clo.course_id
          AND pc.semester_id = course_clo.semester_id
          AND pc.section_id = course_clo.section_id
          AND pc.year = course_clo.year
        JOIN
          clo ON course_clo.clo_id = clo.CLO_id
        JOIN
          course ON course_clo.course_id = course.course_id
        WHERE
          pc.program_id = ?
          AND course_clo.course_id = ?
          AND course_clo.semester_id = ?
          AND course_clo.section_id = ?
          AND course_clo.year = ?
      `;

    const rows = await conn.query(query, [
      program_id,
      course_id,
      semester_id,
      section_id,
      year,
    ]);
    // บังคับให้ rows เป็น array
    const result = Array.isArray(rows) ? rows : [rows];

    res.json(result);
  } catch (err) {
    console.error("Error fetching course CLOs with weight:", err);
    res.status(500).json({ message: "Database error" });
  } finally {
    if (conn) conn.release();
  }
});

app.get("/program_courses_detail", async (req, res) => {
  const { program_id, year } = req.query; // รับ parameter year เพิ่มเติม

  if (!program_id) {
    return res.status(400).json({ message: "Program ID is required" });
  }

  try {
    const conn = await pool.getConnection();
    let query = `SELECT
                pc.program_course_id,
                pc.year,
                pc.semester_id,
                pc.course_id,
                pc.section_id,
                p.program_name,
                c.course_name,
                c.course_engname,
                sm.semester_name
            FROM
                program_course pc
            JOIN program p ON pc.program_id = p.program_id
            JOIN course c ON pc.course_id = c.course_id
            LEFT JOIN section s ON pc.section_id = s.section_id
            JOIN semester sm ON pc.semester_id = sm.semester_id
            WHERE
                pc.program_id = ?`;

    let params = [program_id];

    // ถ้ามีการส่ง year มา ให้เพิ่มเงื่อนไขในการกรอง
    if (year) {
      query += " AND pc.year = ?";
      params.push(year);
    }

    const result = await conn.query(query, params);

    if (Array.isArray(result)) {
      console.log("Number of rows fetched:", result.length);
      console.log(
        "Using filters - Program ID:",
        program_id,
        "Year:",
        year || "All years"
      );
    } else {
      console.log("Result is not an array:", result);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: year
          ? `No courses found for program ${program_id} in year ${year}`
          : `No courses found for program ${program_id}`,
      });
    }

    res.status(200).json(result);
    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching program_course data" });
  }
});

app.get("/plo_clo", async (req, res) => {
  // console.log("\n\nReq -----> ", req);
  const { course_id, section_id, semester_id, year, program_id, clo_ids } =
    req.query;

  if (!course_id || !section_id || !semester_id || !year || !program_id) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required parameters: course_id, section_id, semester_id, year, program_id",
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // แสดงคำสั่ง SQL ที่ใช้ในการดึงข้อมูล PLO-CLO mappings
    const query = `
            SELECT
                plo_clo.PLO_CLO_id,
                plo_clo.year,
                plo_clo.weight,
                plo_clo.semester_id,
                plo_clo.course_id,
                plo_clo.section_id,
                plo_clo.PLO_id,
                plo_clo.CLO_id,
                plo.PLO_code,
                plo.PLO_name,
                plo.PLO_engname,
                clo.CLO_code,
                clo.CLO_name,
                clo.CLO_engname
            FROM
                plo_clo
            JOIN
                plo ON plo_clo.PLO_id = plo.PLO_id
            JOIN
                clo ON plo_clo.CLO_id = clo.CLO_id
            JOIN
                program_plo pp ON plo.PLO_id = pp.plo_id
            WHERE
                plo_clo.course_id = ?
                AND plo_clo.section_id = ?
                AND plo_clo.semester_id = ?
                AND plo_clo.year = ?
                AND pp.program_id = ?
        `;

    console.log("Executing SQL Query:", query);
    console.log("Parameters:", [
      course_id,
      section_id,
      semester_id,
      year,
      program_id,
    ]);

    const result = await conn.query(query, [
      course_id,
      section_id,
      semester_id,
      year,
      program_id,
    ]);

    if (!result || (Array.isArray(result) && result.length === 0)) {
      console.log("No PLO-CLO mappings found");
      return res.status(200).json([]); // ส่ง array ว่างแทนที่จะส่ง 404
    }

    // แปลงข้อมูลให้เป็น array เสมอ
    const mappings = Array.isArray(result) ? result : [result];

    // แปลงค่า BigInt เป็น string ก่อนส่งกลับ
    const sanitizedMappings = mappings.map((mapping) => {
      const sanitizedMapping = {};

      // แปลงทุก property ที่เป็น BigInt เป็น string
      Object.keys(mapping).forEach((key) => {
        sanitizedMapping[key] =
          typeof mapping[key] === "bigint"
            ? mapping[key].toString()
            : mapping[key];
      });

      return sanitizedMapping;
    });

    return res.status(200).json(sanitizedMappings);
  } catch (err) {
    console.error("Error fetching PLO-CLO mappings:", err);
    return res.status(500).json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (conn) conn.release();
  }
});

app.post("/insert_clo", async (req, res) => {
  const {
    program_id,
    course_id,
    section_id,
    semester_id,
    year,
    CLO_code,
    CLO_name,
    CLO_engname,
  } = req.body;

  // ตรวจสอบว่าข้อมูลทั้งหมดถูกเลือกแล้ว
  if (!program_id || !course_id || !section_id || !semester_id || !year) {
    return res.status(400).json({
      error: "Please select all required fields before inserting CLO",
    });
  }

  const conn = await pool.getConnection();
  try {
    // ตรวจสอบว่าข้อมูล program_course มีอยู่ในระบบหรือไม่
    const checkProgramCourseQuery = `
        SELECT * FROM program_course
        WHERE program_id = ? AND course_id = ? AND section_id = ? AND semester_id = ? AND year = ?
      `;

    const results = await conn.query(checkProgramCourseQuery, [
      program_id,
      course_id,
      section_id,
      semester_id,
      year,
    ]);

    if (results.length === 0) {
      return res.status(400).json({
        error: "Selected program/course/section/semester/year not found",
      });
    }

    // Insert CLO
    const insertCLOQuery = `
        INSERT INTO course_clo (program_id, course_id, section_id, semester_id, year, CLO_code, CLO_name, CLO_engname)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

    const result = await conn.query(insertCLOQuery, [
      program_id,
      course_id,
      section_id,
      semester_id,
      year,
      CLO_code,
      CLO_name,
      CLO_engname,
    ]);

    return res.status(200).json({ message: "CLO inserted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error", details: err });
  } finally {
    conn.release(); // Always release the connection back to the pool
  }
});

// API: Delete CLO
app.delete("/delete_clo/:clo_id", async (req, res) => {
  const { clo_id } = req.params;

  if (!clo_id) {
    return res.status(400).json({ error: "CLO ID is required" });
  }

  const conn = await pool.getConnection();
  try {
    const deleteCLOQuery = `
        DELETE FROM course_clo WHERE CLO_id = ?
      `;

    const result = await conn.query(deleteCLOQuery, [clo_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "CLO not found" });
    }

    return res.status(200).json({ message: "CLO deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Failed to delete CLO", details: err });
  } finally {
    conn.release(); // Always release the connection back to the pool
  }
});

//add by ten
// Route ที่ใช้ในการดึงข้อมูลจากฐานข้อมูล
app.get("/api/program", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM program")
        .then((results) => {
          res.json(results); // ส่งข้อมูลที่ได้กลับไปที่ client
        })
        .catch((err) => {
          console.error("Error fetching data from database", err);
          res.status(500).send("Error fetching data");
        })
        .finally(() => {
          conn.release(); // ปล่อยการเชื่อมต่อหลังจากใช้งานเสร็จ
        });
    })
    .catch((err) => {
      console.error("Error connecting to the database", err);
      res.status(500).send("Error connecting to the database");
    });
});

app.post("/plo_clo", async (req, res) => {
  console.log("Received PLO-CLO mapping request body type:", typeof req.body);
  console.log("Is array?", Array.isArray(req.body));

  // แสดงข้อมูลโดยแปลง BigInt เป็น string ก่อน
  const safeStringify = (obj) => {
    return JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
  };

  console.log("Received PLO-CLO mapping request:", safeStringify(req.body));

  // ตรวจสอบและแปลงข้อมูลเป็น array
  let mappingsArray = [];

  // กรณีส่งเป็น array
  if (Array.isArray(req.body)) {
    mappingsArray = req.body;
  }
  // กรณีส่งเป็น object ที่มี scores เป็น array
  else if (req.body.scores && Array.isArray(req.body.scores)) {
    mappingsArray = req.body.scores;
  }
  // กรณีส่งเป็น object เดี่ยว
  else {
    mappingsArray = [req.body];
  }

  // ถ้าไม่มีข้อมูล
  if (mappingsArray.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No mapping data provided",
    });
  }

  console.log(`Processing ${mappingsArray.length} mappings`);

  // ตรวจสอบฟิลด์ที่จำเป็น
  const requiredFields = [
    "PLO_id",
    "CLO_id",
    "course_id",
    "section_id",
    "semester_id",
    "year",
    "weight",
  ];

  // สำหรับเก็บ mapping ที่มีปัญหา
  const invalidMappings = [];

  // สำหรับเก็บ mapping ที่ถูกต้อง
  const validMappings = [];

  // ตรวจสอบและเตรียมข้อมูล
  for (const mapping of mappingsArray) {
    // กรณีที่ข้อมูลอยู่ใน property 'data'
    const dataToCheck = mapping.data || mapping;

    // ตรวจสอบฟิลด์ที่จำเป็น
    const missingFields = requiredFields.filter(
      (field) => dataToCheck[field] === undefined
    );

    if (missingFields.length > 0) {
      invalidMappings.push({
        ...dataToCheck,
        missingFields: missingFields,
      });
      continue;
    }

    // ข้อมูลถูกต้อง ให้แปลงเป็นตัวเลข
    const processedData = {};
    requiredFields.forEach((field) => {
      processedData[field] =
        typeof dataToCheck[field] === "string"
          ? parseInt(dataToCheck[field], 10)
          : Number(dataToCheck[field]);
    });

    // ตรวจสอบว่าข้อมูลเป็นตัวเลขทั้งหมด
    const invalidFields = Object.entries(processedData)
      .filter(([key, value]) => isNaN(value))
      .map(([key]) => key);

    if (invalidFields.length > 0) {
      invalidMappings.push({
        ...dataToCheck,
        invalidFields: invalidFields,
      });
      continue;
    }

    // ข้อมูลถูกต้องทั้งหมด
    validMappings.push(processedData);
  }

  // ถ้าไม่มีข้อมูลที่ถูกต้อง
  if (validMappings.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid mappings found",
      invalidMappings: invalidMappings,
    });
  }

  try {
    const conn = await pool.getConnection();

    // เริ่ม transaction
    await conn.beginTransaction();

    // สำหรับเก็บผลลัพธ์
    const results = {
      inserted: [],
      updated: [],
      errors: [],
    };

    // ประมวลผลทีละ mapping
    for (const data of validMappings) {
      try {
        // ตรวจสอบว่ามีข้อมูลนี้อยู่แล้วหรือไม่
        const checkQuery = `
                    SELECT * FROM plo_clo
                    WHERE course_id = ? AND section_id = ? AND semester_id = ?
                    AND year = ? AND PLO_id = ? AND CLO_id = ?`;

        const existingMappings = await conn.query(checkQuery, [
          data.course_id,
          data.section_id,
          data.semester_id,
          data.year,
          data.PLO_id,
          data.CLO_id,
        ]);

        // แปลงให้เป็น array เสมอ
        const existingMapping = Array.isArray(existingMappings)
          ? existingMappings
          : existingMappings
            ? [existingMappings]
            : [];

        let result;

        if (existingMapping.length > 0) {
          // ถ้ามีข้อมูลอยู่แล้ว ให้อัพเดต
          const updateQuery = `
                        UPDATE plo_clo
                        SET weight = ?
                        WHERE course_id = ? AND section_id = ? AND semester_id = ?
                        AND year = ? AND PLO_id = ? AND CLO_id = ?`;

          result = await conn.query(updateQuery, [
            data.weight,
            data.course_id,
            data.section_id,
            data.semester_id,
            data.year,
            data.PLO_id,
            data.CLO_id,
          ]);

          console.log(
            `Updated existing mapping: PLO=${data.PLO_id}, CLO=${data.CLO_id}, weight=${data.weight}`
          );

          results.updated.push({
            ...data,
            PLO_CLO_id: existingMapping[0].PLO_CLO_id,
          });
        } else {
          // ถ้ายังไม่มีข้อมูล ให้เพิ่มใหม่
          const insertQuery = `
                        INSERT INTO plo_clo (course_id, section_id, semester_id, year, PLO_id, CLO_id, weight)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;

          result = await conn.query(insertQuery, [
            data.course_id,
            data.section_id,
            data.semester_id,
            data.year,
            data.PLO_id,
            data.CLO_id,
            data.weight,
          ]);

          console.log(
            `Inserted new mapping: PLO=${data.PLO_id}, CLO=${data.CLO_id}, weight=${data.weight}`
          );

          // แปลง BigInt เป็น Number
          const insertId =
            typeof result.insertId === "bigint"
              ? Number(result.insertId)
              : result.insertId;

          results.inserted.push({
            ...data,
            PLO_CLO_id: insertId,
          });
        }
      } catch (mappingError) {
        console.error(
          `Error processing mapping:`,
          safeStringify(data),
          mappingError
        );
        results.errors.push({
          mapping: data,
          error: mappingError.message,
        });
      }
    }

    // ยืนยัน transaction
    await conn.commit();
    conn.release();

    // ตรวจสอบผลลัพธ์
    const successCount = results.inserted.length + results.updated.length;

    if (successCount > 0) {
      // เตรียมข้อมูลสำหรับส่งกลับ
      const response = {
        success: true,
        message: `Successfully processed ${successCount} PLO-CLO mappings`,
        details: {
          inserted: results.inserted.length,
          updated: results.updated.length,
          errors: results.errors.length,
        },
      };

      // ส่งข้อมูลกลับไปยัง client
      return res.status(200).json(response);
    } else {
      return res.status(500).json({
        success: false,
        message: "No mappings were processed successfully",
        errors: results.errors,
      });
    }
  } catch (error) {
    console.error("Error in PLO-CLO endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.patch("/plo_clo", async (req, res) => {
  const {
    program_id,
    year,
    semester_id,
    course_id,
    section_id,
    PLO_id,
    CLO_id,
    weight,
  } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (
    !program_id ||
    !year ||
    !semester_id ||
    !course_id ||
    !section_id ||
    !PLO_id ||
    !CLO_id ||
    weight === undefined
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: year, semester_id, course_id, section_id, PLO_id, CLO_id, or weight.",
    });
  }

  try {
    const conn = await pool.getConnection();

    // ตรวจสอบข้อมูลปัจจุบัน
    const queryCheck = `
            SELECT weight
            FROM plo_clo
            WHERE year = ? AND semester_id = ? AND course_id = ? AND section_id = ? AND PLO_id = ? AND CLO_id = ?
        `;
    const [currentWeight] = await conn.query(queryCheck, [
      year,
      semester_id,
      course_id,
      section_id,
      PLO_id,
      CLO_id,
    ]);

    // หาก weight ไม่เปลี่ยนแปลงให้ส่งข้อความกลับ
    if (currentWeight.length > 0 && currentWeight[0].weight === weight) {
      conn.release();
      return res.status(400).json({
        success: false,
        message: "The weight value is already the same as the current one.",
      });
    }

    // อัปเดตเฉพาะค่า weight
    const queryUpdate = `
            UPDATE plo_clo
            SET weight = ?
            WHERE year = ? AND semester_id = ? AND course_id = ? AND section_id = ? AND PLO_id = ? AND CLO_id = ?
        `;
    const result = await conn.query(queryUpdate, [
      weight,
      year,
      semester_id,
      course_id,
      section_id,
      PLO_id,
      CLO_id,
    ]);

    conn.release();

    // แปลงค่า BigInt ให้เป็น String ก่อนที่จะส่งค่าผ่าน JSON
    const serializedResult = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.json({
      success: true,
      message: "Weight updated successfully.",
      result: serializedResult,
    });
  } catch (error) {
    console.error("Error updating weight:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

//edit1 by ninew
app.post("/api/save_assignment_clo", async (req, res) => {
  const { data } = req.body; // ข้อมูลที่ส่งมาจาก frontend
  if (!data || !Array.isArray(data)) {
    return res.status(400).send({ message: "Invalid data format" });
  }

  try {
    const conn = await pool.getConnection();

    // เริ่มต้นการทำงานกับฐานข้อมูลโดยใช้ query batch
    const queries = data.map((item) => {
      return conn.query(
        `
                INSERT INTO Assignment_CLO_Selection (clo_id, assignment_id, score, weight)
                VALUES (?, ?, ?, ?)`,
        [item.item.clo_id, item.assignment_id, item.score, item.weight] // เพิ่ม 'score'
      );
    });

    // รอให้คำสั่งทั้งหมดทำงานเสร็จ
    await Promise.all(queries);

    res.status(200).send({ message: "Data saved successfully" });
    conn.release();
  } catch (err) {
    console.error("Error saving CLO data:", err);
    res
      .status(500)
      .send({ message: "Error saving CLO data", error: err.message });
  }
});
// DELETE Assignment
app.delete("/api/delete_assignment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    const query = "DELETE FROM assignments WHERE assignment_id = ?";
    await conn.query(query, [id]);
    conn.release();
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (err) {
    console.error("Error deleting assignment:", err);
    res.status(500).json({ message: "Failed to delete assignment" });
  }
});

app.delete("/api/remove_student_from_assignment", async (req, res) => {
  const { assignment_id, student_id } = req.body;

  if (!assignment_id || !student_id) {
    return res.status(400).json({
      success: false,
      message: "ข้อมูลไม่ครบถ้วน กรุณาระบุ assignment_id และ student_id",
    });
  }

  let conn;

  try {
    // สร้างการเชื่อมต่อกับฐานข้อมูล
    conn = await pool.getConnection();

    // ตรวจสอบว่ามีนักเรียนนี้ใน Assignment หรือไม่
    const assignmentStudentsCheck = await conn.query(
      `SELECT * FROM assignments_students
         WHERE assignment_id = ? AND student_id = ?`,
      [assignment_id, student_id]
    );

    if (!assignmentStudentsCheck || assignmentStudentsCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลนักเรียนใน Assignment นี้",
      });
    }

    // เริ่ม transaction
    await conn.beginTransaction();

    // ลบข้อมูลคะแนนของนักเรียนในทุก CLO ของ Assignment นี้
    await conn.query(
      `DELETE FROM student_assignment_scores
         WHERE assignment_id = ? AND student_id = ?`,
      [assignment_id, student_id]
    );

    // ลบข้อมูลนักเรียนออกจาก Assignment
    await conn.query(
      `DELETE FROM assignments_students
         WHERE assignment_id = ? AND student_id = ?`,
      [assignment_id, student_id]
    );

    // ยืนยัน transaction
    await conn.commit();

    res.json({
      success: true,
      message: "ลบนักเรียนออกจาก Assignment เรียบร้อยแล้ว",
    });
  } catch (error) {
    // ถ้าเกิดข้อผิดพลาด ให้ rollback transaction
    if (conn) {
      await conn.rollback();
    }

    console.error("Error removing student:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการลบนักเรียน: " + error.message,
    });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

// UPDATE Assignment
// UPDATE Assignment (ไม่ต้องตรวจสอบความครบถ้วน)

// app.put('/api/update_assignment/:id', async (req, res) => {
//     const { id } = req.params;
//     const { assignment_name, course } = req.body;

//     try {
//         const conn = await pool.getConnection();

//         // ✅ 1. เตรียมการอัปเดตสำหรับตาราง assignments
//         let assignmentQuery = 'UPDATE assignments SET ';
//         const assignmentParams = [];

//         if (assignment_name) {
//             assignmentQuery += 'assignment_name = ?, ';
//             assignmentParams.push(assignment_name);
//         }
//         if (course) {
//             assignmentQuery += 'course_name = ?, ';
//             assignmentParams.push(course);
//         }

//         // ถ้าไม่มีฟิลด์ที่เปลี่ยนแปลง ไม่ต้องอัปเดต
//         if (assignmentParams.length === 0) {
//             conn.release();
//             return res.status(400).json({ message: 'ไม่มีฟิลด์ที่ต้องอัปเดต' });
//         }

//         assignmentQuery = assignmentQuery.slice(0, -2); // ลบเครื่องหมาย , ที่ท้ายสุด
//         assignmentQuery += ' WHERE assignment_id = ?';
//         assignmentParams.push(id);

//         const assignmentResult = await conn.query(assignmentQuery, assignmentParams);

//         if (assignmentResult.affectedRows === 0) {
//             conn.release();
//             return res.status(404).json({ message: 'Assignment not found' });
//         }

//         // ✅ 2. เตรียมการอัปเดตสำหรับตาราง Assignments_Students
//         let studentQuery = 'UPDATE Assignments_Students SET ';
//         const studentParams = [];

//         if (assignment_name) {
//             studentQuery += 'assignment_name = ?, ';
//             studentParams.push(assignment_name);
//         }
//         if (course) {
//             studentQuery += 'course = ?, ';
//             studentParams.push(course);
//         }

//         // อัปเดตเฉพาะฟิลด์ที่มีการเปลี่ยนแปลง
//         if (studentParams.length > 0) {
//             studentQuery = studentQuery.slice(0, -2); // ลบเครื่องหมาย , ที่ท้ายสุด
//             studentQuery += ' WHERE assignment_id = ?';
//             studentParams.push(id);

//             const studentsResult = await conn.query(studentQuery, studentParams);
//             if (studentsResult.affectedRows === 0) {
//                 console.warn('Warning: No student records were updated.');
//             }
//         }

//         conn.release();
//         res.status(200).json({ message: 'Assignment and student records updated successfully' });

//     } catch (err) {
//         console.error('Error updating assignment:', err);
//         res.status(500).json({ message: 'Failed to update assignment and student records' });
//     }
// });
// In your backend route file

// Update an existing assignment
app.put("/api/update_assignment/:id", async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const {
      program_id,
      course_name,
      section_id,
      semester_id,
      year,
      assignment_name,
      faculty_id,
      university_id,
    } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    const requiredFields = {
      program_id,
      course_name,
      section_id,
      semester_id,
      year,
      assignment_name,
      faculty_id,
      university_id,
    };

    // ตรวจสอบว่าทุกฟิลด์มีค่า
    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null) {
        return res.status(400).json({
          error: `Missing required field: ${field}`,
        });
      }
    }

    // Update the assignment
    const updateQuery = `
        UPDATE assignments
        SET program_id = ?,
            course_name = ?,
            section_id = ?,
            semester_id = ?,
            year = ?,
            assignment_name = ?,
            faculty_id = ?,
            university_id = ?
        WHERE assignment_id = ?
      `;

    console.log("Executing update query with data:", [
      program_id,
      course_name,
      section_id,
      semester_id,
      year,
      assignment_name,
      faculty_id,
      university_id,
      assignmentId,
    ]);

    const result = await pool.query(updateQuery, [
      program_id,
      course_name,
      section_id,
      semester_id,
      year,
      assignment_name,
      faculty_id,
      university_id,
      assignmentId,
    ]);

    console.log("Update result:", result);

    res.json({
      message: "Assignment updated successfully",
      assignment_id: assignmentId,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({
      error: "Failed to update assignment",
      details: error.message,
    });
  }
});

app.get("/university", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const query = `
            SELECT university_id, university_name_en, university_name_th
            FROM university
            ORDER BY university_name_en;
        `;
    const rows = await conn.query(query);
    conn.release();

    res.status(200).json(Array.isArray(rows) ? rows : [rows]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching universities", error: err });
  }
});

// แก้ไข API `/faculty` ในไฟล์ server.js
app.get("/faculty", async (req, res) => {
  try {
    const { university_id } = req.query;

    if (!university_id) {
      return res.status(400).json({ message: "university_id is required" });
    }

    const conn = await pool.getConnection();

    try {
      const query = `
                SELECT f.faculty_id, f.faculty_name_en, f.faculty_name_th
                FROM university_faculty uf
                JOIN faculty f ON uf.faculty_id = f.faculty_id
                WHERE uf.university_id = ?
                ORDER BY f.faculty_name_en;
            `;

      const rows = await conn.query(query, [university_id]);

      // แปลงให้เป็น array เสมอก่อนส่งกลับ
      const facultyData = Array.isArray(rows) ? rows : [rows].filter(Boolean);

      res.status(200).json(facultyData);
    } finally {
      // ตรวจสอบให้แน่ใจว่ามีการ release connection เสมอ
      conn.release();
    }
  } catch (err) {
    console.error("Error fetching faculties:", err);
    // ส่งกลับข้อผิดพลาดเป็น JSON เสมอ
    res
      .status(500)
      .json({ message: "Error fetching faculties", error: err.message });
  }
});

app.post("/program_faculty", async (req, res) => {
  let conn;
  try {
    // Log the incoming request body
    console.log("Received program_faculty request body:", req.body);

    // Check if database connection is available
    conn = await pool.getConnection();

    if (!conn) {
      console.error("No database connection available");
      return res.status(500).json({
        error: "Database connection is undefined",
        details: "Could not establish a database connection",
      });
    }

    const { program_id, faculty_id } = req.body;

    // Validate input
    if (!program_id || !faculty_id) {
      return res.status(400).json({
        error: "Invalid input",
        details: "program_id and faculty_id are required",
      });
    }

    // Convert program_id and faculty_id to strings to handle BigInt
    const programIdString = program_id.toString();
    const facultyIdString = faculty_id.toString();

    // Perform database insertion
    const result = await conn.query(
      "INSERT INTO program_faculty (program_id, faculty_id) VALUES (?, ?)",
      [programIdString, facultyIdString]
    );

    console.log("Insertion result:", result);

    // Custom serialization for the response
    res.status(200).json({
      message: "Program faculty added successfully",
      result: {
        // Convert BigInt values to strings
        affectedRows: result.affectedRows ? result.affectedRows.toString() : 0,
        insertId: result.insertId ? result.insertId.toString() : null,
      },
    });
  } catch (error) {
    console.error("Error in program_faculty route:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      // Add more detailed error logging
      code: error.code,
      sqlMessage: error.sqlMessage,
    });

    res.status(500).json({
      error: "Database insertion failed",
      details: error.message,
      // Optionally add more context
      errorName: error.name,
      errorCode: error.code,
    });
  } finally {
    // Always release the connection
    if (conn) conn.release();
  }
});
