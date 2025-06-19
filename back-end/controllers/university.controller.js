import pool from "../utils/db.js";

async function getAll(req, res) {
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
}

async function insertOne(req, res) {
  const query = `INSERT INTO university(university_name_en, university_name_th)
  VALUES ("Naresuan University","มหาวิทยาลัยนเรศวร");`;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(query);
    res.status(201).json({
      message: "insert successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

async function getFaculty(req, res) {
  try {
    const { university_id } = req.params;

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
}

async function addProgramFaculty(req, res) {
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
}

export { getAll, insertOne, getFaculty, addProgramFaculty };
