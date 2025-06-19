import pool from "../utils/db.js";

async function importExcel(req, res) {
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

      if (!program_id || !course_id || !course_name || !semester_id || !year) {
        conn.release();
        console.log(course);
        return res.status(400).json({
          message:
            "Missing required fields in some rows. Please ensure all fields are complete.",
        });
      }

      const checkCourseQuery = `
          SELECT 1 FROM course WHERE course_id = ?
        `;

      const courseResult = await conn.query(checkCourseQuery, [course_id]);
      const existingCourse = courseResult[0];

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

      const checkSectionQuery = `
          SELECT 1 FROM section WHERE section_id = ?
        `;

      const sectionResult = await conn.query(checkSectionQuery, [section_id]);
      const existingSection = sectionResult[0];

      if (!existingSection || existingSection.length === 0) {
        const insertSectionQuery = `
              INSERT INTO section (section_id)
              VALUES (?)
            `;

        await conn.query(insertSectionQuery, [section_id]);
      }

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

    res.status(201).json({ message: "All courses uploaded successfully!" });
    conn.release();
  } catch (err) {
    console.error("Error adding courses from Excel:", err);
    res.status(500).json({
      message: "Database error occurred while processing Excel data.",
      error: err.message,
    });
  }
}
// async function importExcel(req, res) {
//   console.log(req.body);
//   res.status(200).json({ body: req.body });
// }

async function getOneById(req, res) {
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
}

async function createOne(req, res) {
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
}

async function deleteOneById(req, res) {
  const { program_id, semester_id, course_id, section_id } = req.query; // รับค่าจาก query parameters

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
            WHERE program_id = ? AND semester_id = ? AND course_id = ? AND section_id = ?
        `;

    const deleteQuery2 = `
      DELETE FROM course
      WHERE course_id = ?
    `;

    const getCountCourseBySection = `
      SELECT COUNT(*) AS count FROM program_course WHERE program_id = ? AND semester_id = ? AND course_id = ?
    `;

    // Execute SQL Query
    const result = await conn.query(deleteQuery, [
      program_id,
      semester_id,
      course_id,
      section_id,
    ]);
    const count_course = await conn.query(getCountCourseBySection, [
      program_id,
      semester_id,
      course_id,
    ]);
    if (count_course[0].count == 0) {
      console.log("delete 2");
      await conn.query(deleteQuery2, [course_id]);
    }
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
}

async function updateOneByCourseId(req, res) {
  const { course_id } = req.params;
  const updateFields = req.body;

  // Validate that at least one update field is provided
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No update fields provided" });
  }

  // Define allowed fields for update - เพิ่ม section_id ในรายการ
  const allowedFields = [
    "course_name",
    "course_engname",
    "new_course_id",
    "program_id",
    "semester_id",
    "section_id", // เพิ่ม section_id ในรายการ
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

    // ถ้ามี section_id ให้ตรวจสอบว่ามีอยู่ในตาราง section หรือไม่
    if (updateFields.section_id) {
      // ตรวจสอบว่า section_id มีอยู่แล้วหรือไม่
      const [existingSection] = await conn.query(
        "SELECT section_id FROM section WHERE section_id = ?",
        [updateFields.section_id]
      );

      // ถ้าไม่มี section_id นี้ ให้สร้างใหม่
      if (!existingSection || existingSection.length === 0) {
        await conn.query("INSERT INTO section (section_id) VALUES (?)", [
          updateFields.section_id,
        ]);
        console.log(`Created new section with ID: ${updateFields.section_id}`);
      }
    }

    // Dynamic update logic
    const updateOperations = [];
    const updateValues = [];

    // Construct dynamic update query for course table
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
      // Check if the new course ID already exists
      const [existingNewCourse] = await conn.query(
        "SELECT course_id FROM course WHERE course_id = ?",
        [updateFields.new_course_id]
      );

      // ถ้า new_course_id ไม่มีในฐานข้อมูล แต่เราต้องมี course_name และ course_engname สำหรับสร้าง
      if (!existingNewCourse || existingNewCourse.length === 0) {
        // ตรวจสอบว่าต้องมี course_name และ course_engname มาด้วย
        if (!updateFields.course_name || !updateFields.course_engname) {
          // ลองดึงข้อมูลจากคอร์สเดิม
          const [currentCourseResult] = await conn.query(
            "SELECT * FROM course WHERE course_id = ?",
            [course_id]
          );

          // ถ้าไม่มีคอร์สเดิม และไม่มีข้อมูลใหม่ครบ จะไม่สามารถสร้างคอร์สใหม่ได้
          if (!currentCourseResult || currentCourseResult.length === 0) {
            // ถ้าไม่มีข้อมูลคอร์สเดิม และไม่มีข้อมูลใหม่ครบ
            await conn.rollback();
            return res.status(400).json({
              message:
                "When creating a new course ID, you must provide course_name and course_engname if the original course does not exist.",
            });
          }

          // ใช้ข้อมูลจากคอร์สเดิม
          const currentCourse = currentCourseResult[0];
          updateFields.course_name =
            updateFields.course_name || currentCourse.course_name;
          updateFields.course_engname =
            updateFields.course_engname || currentCourse.course_engname;
        }

        // สร้างคอร์สใหม่
        await conn.query(
          "INSERT INTO course (course_id, course_name, course_engname) VALUES (?, ?, ?)",
          [
            updateFields.new_course_id,
            updateFields.course_name,
            updateFields.course_engname,
          ]
        );
      }

      try {
        // อัปเดตตาราง program_course
        await conn.query(
          "UPDATE program_course SET course_id = ? WHERE course_id = ?",
          [updateFields.new_course_id, course_id]
        );
      } catch (error) {
        console.log("Error updating program_course:", error.message);
        throw error; // ส่งต่อข้อผิดพลาดไปยัง catch block หลัก
      }

      // อัปเดตตารางอื่นๆ แบบไม่บังคับ (optional updates)
      try {
        await conn.query(
          "UPDATE course_plo SET course_id = ? WHERE course_id = ?",
          [updateFields.new_course_id, course_id]
        );
      } catch (error) {
        console.log("No records or error updating course_plo:", error.message);
      }

      try {
        await conn.query(
          "UPDATE plo_clo SET course_id = ? WHERE course_id = ?",
          [updateFields.new_course_id, course_id]
        );
      } catch (error) {
        console.log("No records or error updating plo_clo:", error.message);
      }

      try {
        await conn.query(
          "UPDATE course_clo SET course_id = ? WHERE course_id = ?",
          [updateFields.new_course_id, course_id]
        );
      } catch (error) {
        console.log("No records or error updating course_clo:", error.message);
      }
    } else {
      // ถ้าไม่มี new_course_id ให้อัพเดตตารางหลัก course
      if (updateOperations.length > 0) {
        const updateQuery = `UPDATE course 
                  SET ${updateOperations.join(", ")} 
                  WHERE course_id = ?`;

        updateValues.push(course_id);

        try {
          await conn.query(updateQuery, updateValues);
        } catch (error) {
          console.log("Error updating course:", error.message);
          throw error; // ส่งต่อข้อผิดพลาดไปยัง catch block หลัก
        }
      }
    }

    // ถ้ามี section_id ให้อัพเดตในตาราง program_course
    if (updateFields.section_id) {
      try {
        await conn.query(
          "UPDATE program_course SET section_id = ? WHERE course_id = ?",
          [updateFields.section_id, updateFields.new_course_id || course_id]
        );
      } catch (error) {
        console.log("Error updating section_id:", error.message);
      }
    }

    // ถ้ามี program_id ให้อัพเดตในตาราง program_course
    if (updateFields.program_id) {
      try {
        await conn.query(
          "UPDATE program_course SET program_id = ? WHERE course_id = ?",
          [updateFields.program_id, updateFields.new_course_id || course_id]
        );
      } catch (error) {
        console.log("Error updating program_id:", error.message);
      }
    }

    // ถ้ามี semester_id ให้อัพเดตในตาราง program_course
    if (updateFields.semester_id) {
      try {
        await conn.query(
          "UPDATE program_course SET semester_id = ? WHERE course_id = ?",
          [updateFields.semester_id, updateFields.new_course_id || course_id]
        );
      } catch (error) {
        console.log("Error updating semester_id:", error.message);
      }
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
}

async function getManyCourseDetail(req, res) {
  const { program_id, year, semester_id } = req.query;

  let conn;
  if (!program_id) {
    return res.status(400).json({ message: "Program ID is required" });
  }

  try {
    conn = await pool.getConnection();
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
    if (semester_id) {
      query += " AND pc.semester_id = ?";
      params.push(semester_id);
    }

    if (semester_id) {
      query += " AND pc.semester_id = ?";
      params.push(semester_id);
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
  } finally {
    if (conn) conn.release();
  }
}

async function updateOneByCourseSectionId(req, res) {
  const { course_id, section_id } = req.params; // รับค่าทั้ง course_id และ section_id จาก URL
  const updateFields = req.body;
  // Validate that at least one update field is provided
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No update fields provided" });
  }

  // ตรวจสอบพิเศษสำหรับ program_id และ semester_id - ถ้ามีการพยายามอัพเดท fields เหล่านี้ ให้ส่ง error กลับทันที
  if ("program_id" in updateFields || "semester_id" in updateFields) {
    return res.status(400).json({
      message:
        "Cannot update program_id or semester_id. Only course_id, course_name, course_engname, and section_id can be modified.",
    });
  }

  // Define allowed fields for update - อนุญาตเฉพาะฟิลด์ที่กำหนด
  const allowedFields = [
    "course_name",
    "course_engname",
    "new_course_id",
    "new_section_id",
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

    // ตรวจสอบว่า section_id ปัจจุบันมีอยู่ในตาราง section หรือไม่
    const [existingSection] = await conn.query(
      "SELECT section_id FROM section WHERE section_id = ?",
      [section_id]
    );

    // ถ้าไม่มี section_id ปัจจุบัน ให้สร้างใหม่
    if (!existingSection || existingSection.length === 0) {
      await conn.query("INSERT INTO section (section_id) VALUES (?)", [
        section_id,
      ]);
      console.log(`Created new section with ID: ${section_id}`);
    }

    // ถ้ามีการระบุ new_section_id ให้ตรวจสอบว่ามีอยู่ในตาราง section หรือไม่
    if (updateFields.new_section_id) {
      const [existingNewSection] = await conn.query(
        "SELECT section_id FROM section WHERE section_id = ?",
        [updateFields.new_section_id]
      );

      // ถ้าไม่มี new_section_id ให้สร้างใหม่
      if (!existingNewSection || existingNewSection.length === 0) {
        await conn.query("INSERT INTO section (section_id) VALUES (?)", [
          updateFields.new_section_id,
        ]);
        console.log(
          `Created new section with ID: ${updateFields.new_section_id}`
        );
      }
    }

    // ตรวจสอบว่ามีข้อมูลในตาราง program_course ที่ตรงกับ course_id และ section_id ที่ระบุหรือไม่
    const [existingProgramCourseResult] = await conn.query(
      "SELECT * FROM program_course WHERE course_id = ? AND section_id = ?",
      [course_id, section_id]
    );

    if (
      !existingProgramCourseResult ||
      existingProgramCourseResult.length === 0
    ) {
      return res.status(404).json({
        message: `No program course found with course_id ${course_id} and section_id ${section_id}`,
      });
    }

    // ตรวจสอบและกำหนดค่าให้ existingProgramCourse ด้วยความระมัดระวัง
    let existingProgramCourse = null;
    if (existingProgramCourseResult && existingProgramCourseResult.length > 0) {
      existingProgramCourse = existingProgramCourseResult[0];
    } else {
      // ถ้าไม่พบข้อมูล program_course (ซึ่งไม่ควรเกิดขึ้นเนื่องจากเราตรวจสอบแล้วด้านบน)
      // แต่ถ้าเกิดขึ้น เราจะทำการจัดการที่เหมาะสม
      await conn.rollback();
      return res.status(404).json({
        message: `No program course found with course_id ${course_id} and section_id ${section_id}`,
      });
    }

    // Dynamic update logic
    const updateOperations = [];
    const updateValues = [];

    // Construct dynamic update query for course table
    if (updateFields.course_name) {
      updateOperations.push("course_name = ?");
      updateValues.push(updateFields.course_name);
    }

    if (updateFields.course_engname) {
      updateOperations.push("course_engname = ?");
      updateValues.push(updateFields.course_engname);
    }

    // ตัวแปรสำหรับเก็บ course_id และ section_id ที่จะใช้ในการอัพเดต
    const targetCourseId = updateFields.new_course_id || course_id;
    const targetSectionId = updateFields.new_section_id || section_id;

    // If new course ID is provided, handle it separately
    if (updateFields.new_course_id) {
      // Check if the new course ID already exists
      const [existingNewCourse] = await conn.query(
        "SELECT course_id FROM course WHERE course_id = ?",
        [updateFields.new_course_id]
      );

      // ถ้า new_course_id ไม่มีในฐานข้อมูล แต่เราต้องมี course_name และ course_engname สำหรับสร้าง
      if (!existingNewCourse || existingNewCourse.length === 0) {
        // ตรวจสอบว่าต้องมี course_name และ course_engname มาด้วย
        if (!updateFields.course_name || !updateFields.course_engname) {
          // ลองดึงข้อมูลจากคอร์สเดิม
          const [currentCourseResult] = await conn.query(
            "SELECT * FROM course WHERE course_id = ?",
            [course_id]
          );

          // ถ้าไม่มีคอร์สเดิม และไม่มีข้อมูลใหม่ครบ จะไม่สามารถสร้างคอร์สใหม่ได้
          if (!currentCourseResult || currentCourseResult.length === 0) {
            // ถ้าไม่มีข้อมูลคอร์สเดิม และไม่มีข้อมูลใหม่ครบ
            await conn.rollback();
            return res.status(400).json({
              message:
                "When creating a new course ID, you must provide course_name and course_engname if the original course does not exist.",
            });
          }

          // ใช้ข้อมูลจากคอร์สเดิม
          const currentCourse = currentCourseResult[0];
          updateFields.course_name =
            updateFields.course_name || currentCourse.course_name;
          updateFields.course_engname =
            updateFields.course_engname || currentCourse.course_engname;
        }

        // สร้างคอร์สใหม่
        await conn.query(
          "INSERT INTO course (course_id, course_name, course_engname) VALUES (?, ?, ?)",
          [
            updateFields.new_course_id,
            updateFields.course_name,
            updateFields.course_engname,
          ]
        );
      }
    }

    // ถ้ามีการเปลี่ยน course_id หรือ section_id หรือทั้งสองอย่าง
    if (updateFields.new_course_id || updateFields.new_section_id) {
      try {
        // ตรวจสอบว่ามีข้อมูลในตาราง program_course สำหรับ course_id และ section_id ใหม่หรือไม่
        const [existingNewProgramCourse] = await conn.query(
          "SELECT * FROM program_course WHERE course_id = ? AND section_id = ?",
          [targetCourseId, targetSectionId]
        );

        if (existingNewProgramCourse && existingNewProgramCourse.length > 0) {
          // ถ้ามีข้อมูลอยู่แล้ว ให้ข้ามไป - ไม่อัพเดตเนื่องจากเราไม่ต้องการให้เปลี่ยนแปลง program_id หรือ semester_id
          console.log(
            "Program course for new course_id and section_id already exists. No update needed."
          );
        } else {
          // สร้างเรคอร์ดใหม่ใน program_course
          await conn.query(
            "UPDATE program_course SET course_id = ?, section_id = ? WHERE course_id = ? AND section_id = ?",
            [
              updateFields.new_course_id,
              updateFields.new_section_id,
              course_id,
              section_id,
            ]
          );

          // ลบเรคอร์ดเดิม
          await conn.query(
            "DELETE FROM program_course WHERE course_id = ? AND section_id = ?",
            [course_id, section_id]
          );
        }

        // อัพเดตตารางอื่นๆ ที่เกี่ยวข้อง
        try {
          // อัพเดตตาราง plo_clo
          await conn.query(
            "UPDATE plo_clo SET course_id = ?, section_id = ? WHERE course_id = ? AND section_id = ?",
            [targetCourseId, targetSectionId, course_id, section_id]
          );
        } catch (error) {
          console.log("No records or error updating plo_clo:", error.message);
        }

        try {
          // อัพเดตตาราง course_clo
          await conn.query(
            "UPDATE course_clo SET course_id = ?, section_id = ? WHERE course_id = ? AND section_id = ?",
            [targetCourseId, targetSectionId, course_id, section_id]
          );
        } catch (error) {
          console.log(
            "No records or error updating course_clo:",
            error.message
          );
        }
      } catch (error) {
        console.log("Error updating program_course:", error.message);
        throw error;
      }
    } else {
      // ถ้าไม่มีการเปลี่ยน course_id หรือ section_id ให้อัพเดตข้อมูลอื่นๆ ตามที่ระบุ

      // อัพเดตตารางหลัก course
      if (updateOperations.length > 0) {
        const updateQuery = `UPDATE course 
                  SET ${updateOperations.join(", ")} 
                  WHERE course_id = ?`;

        updateValues.push(course_id);

        try {
          await conn.query(updateQuery, updateValues);
        } catch (error) {
          console.log("Error updating course:", error.message);
          throw error;
        }
      }

      // ตัดส่วนการอัพเดต semester_id ออกทั้งหมด เนื่องจากไม่ต้องการให้แก้ไข
    }

    await conn.commit();
    res.status(200).json({
      message: "Course updated successfully.",
      updatedFields: Object.keys(updateFields),
      originalValues: {
        course_id,
        section_id,
      },
      newValues: {
        course_id: targetCourseId,
        section_id: targetSectionId,
      },
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
}

export async function getManyCourseByProgram(req, res) {
  const { program_id, semester_id, year } = req.query;
  let query = `
  SELECT pc.program_course_id, pc.course_id, c.course_name, c.course_engName, pc.section_id, pc.program_id, pc.year, pc.semester_id
  FROM program_course AS pc
  LEFT JOIN course AS c ON pc.course_id=c.course_id`;

  let conditions = [];
  let params = [];

  if (program_id) {
    conditions.push("pc.program_id = ?");
    params.push(program_id);
  }

  if (semester_id) {
    conditions.push("pc.semester_id = ?");
    params.push(semester_id);
  }

  if (year) {
    conditions.push("pc.year = ?");
    params.push(year);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  try {
    const rows = await pool.query(query, params);
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while fetching many course" });
  }
}

export {
  importExcel,
  getOneById,
  createOne,
  deleteOneById,
  updateOneByCourseId,
  getManyCourseDetail,
  updateOneByCourseSectionId,
};
