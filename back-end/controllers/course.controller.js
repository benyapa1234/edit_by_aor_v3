import pool from "../utils/db.js";

async function getAll(req, res) {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(`SELECT 
      c.course_id,
        c.course_name,
        c.course_engname,
        pc.year
    FROM program_course AS pc
    LEFT JOIN course AS c ON pc.course_id=c.course_id`);
    res.json(result);
    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching course");
  }
}

async function getOneById(req, res) {
  const { course_id } = req.params;
  try {
    const query = `SELECT * FROM course WHERE course_id = ?`;
    const result = await pool.query(query, [course_id]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Error fetching course");
  }
}

async function createOne(req, res) {
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
}

async function updateOneById(req, res) {
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
}

async function deleteOneById(req, res) {
  const { course_id } = req.params;
  try {
    await pool.query("DELETE FROM course WHERE course_id = ?", [course_id]);
    res.status(200).send("Course deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting course");
  }
}

async function getManyByFilter(req, res) {
  const { semester_id, year } = req.query;

  try {
    const response = await pool.query(
      "SELECT DISTINCT c.course_id, c.course_name, c.course_engname FROM program_course AS pc LEFT JOIN course AS c ON pc.course_id=c.course_id WHERE pc.semester_id=? AND pc.year=? ORDER BY course_id ASC",
      [semester_id, year]
    );
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error get course something with filter...");
  }
}

async function importCoursesFromExcel(req, res) {
  const courseArray = req.body;
  const conn = await pool.getConnection();
  const message = [];
  await conn.beginTransaction();
  try {
    const isExistsInCourseQuery = `
      SELECT
        course_id
      FROM
        course
      WHERE
        course_id=?
    `;
    const isExistsInSelectedProgramQuery = `
      SELECT
        program_course_id
      FROM
        program_course
      WHERE
        course_id=? AND
        year = ? AND
        semester_id = ? AND
        section_id = ? AND
        program_id = ?
    `;
    const queryInsertIntoCourse = `
      INSERT INTO
        course (course_id, course_name, course_engname, timestamp)
      VALUES (?, ?, ?, now())
    `;
    const queryInsertIntoProgramCourse = `
      INSERT INTO
        program_course (year, semester_id, course_id, section_id, program_id)
      VALUES (?, ?, ?, ?, ?);
    `;
    const checkedSectionQuery = `
      SELECT section_id FROM section WHERE section_id = ?
    `;
    const insertSectionQuery = `
      INSERT INTO section(section_id) VALUES(?)
    `;

    for (let i = 0; i < courseArray.length; i++) {
      const {
        course_id,
        course_name,
        course_engname,
        program_id,
        section_id,
        semester_id,
        year,
      } = courseArray[i];

      const isExistsInCourse = await conn.query(isExistsInCourseQuery, [
        course_id,
      ]);

      if (!isExistsInCourse[0]) {
        await conn.query(queryInsertIntoCourse, [
          course_id,
          course_name,
          course_engname,
        ]);
      }

      const isExistsInSelectedProgram = await conn.query(
        isExistsInSelectedProgramQuery,
        [course_id, year, semester_id, section_id, program_id]
      );

      if (isExistsInSelectedProgram[0]) {
        message.push({
          course: courseArray[i],
          message: "มีรายวิชานี้ในหลักสูตรนี้แล้ว",
        });
        continue;
      } else {
        const sectionIsExists = await conn.query(checkedSectionQuery, [
          section_id,
        ]);

        if (!sectionIsExists[0]) {
          await conn.query(insertSectionQuery, [section_id]);
        }

        await conn.query(queryInsertIntoProgramCourse, [
          year,
          semester_id,
          course_id,
          section_id,
          program_id,
        ]);

        message.push({
          course: courseArray[i],
          message: "เพิ่มรายวิชานี้ในหลักสูตรนี้แล้ว",
        });
      }
    }

    await conn.commit();
    res.status(201).json(message);
  } catch (error) {
    await conn.rollback();
    res.status(500).json({
      message: "Error while import course from Excel",
      error: error.message,
    });
  }
}

export {
  getAll,
  createOne,
  getOneById,
  updateOneById,
  deleteOneById,
  getManyByFilter,
  importCoursesFromExcel,
};
