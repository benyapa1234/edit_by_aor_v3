import pool from "../utils/db.js";

async function getPrograms(req, res) {
  const { faculty_id, program_name, year } = req.query;
  try {
    const conn = await pool.getConnection();

    let query;
    let params = [];

    if (faculty_id) {
      query = `
                SELECT p.* 
                FROM program p
                JOIN program_faculty pf ON p.program_id = pf.program_id
                WHERE pf.faculty_id = ${faculty_id}`;
    } else {
      query = `SELECT * FROM program`;
    }

    if (program_name) {
      query += ` AND p.program_name = "${program_name}"`;
    }
    if (year) {
      query += ` AND p.year = ${year}`;
    }

    const result = await conn.query(query);

    if (!result.length) {
      return res.json([]); // ✅ ถ้าไม่มีข้อมูล ให้ส่ง array ว่างแทน
    }

    res.json(result);
    conn.release();
  } catch (err) {
    console.error("Database error:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}

async function createOne(req, res) {
  let conn;
  try {
    const {
      code,
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

    // Validate year - แก้ไขให้รับปีอะไรก็ได้
    let parsedYear = null;
    if (year !== null && year !== undefined) {
      parsedYear = Number(year);
      if (isNaN(parsedYear)) {
        errors.push("Year must be a valid number");
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
            (code, program_name, program_name_th, year, program_shortname_en, program_shortname_th) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

    // Execute query
    const result = await conn.query(query, [
      code,
      program_name,
      program_name_th,
      parsedYear, // Use the parsed year
      program_shortname_en,
      program_shortname_th,
    ]);

    // Fetch the newly created program - เพิ่มการ fetch หลังจาก insert
    const fetchQuery = `SELECT * FROM program WHERE program_id = ?`;
    const fetchResult = await conn.query(fetchQuery, [result.insertId]);
    const newProgram = fetchResult[0];

    // Send success response with the complete program data
    res.status(201).json({
      message: "Program added successfully",
      program_id: Number(result.insertId),
      program: newProgram // ส่งข้อมูล program ที่เพิ่งสร้างกลับไป
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
}

async function updateOneById(req, res) {
  const { program_id } = req.params;
  const {
    code,
    program_name,
    program_name_th,
    year,
    program_shortname_en,
    program_shortname_th,
  } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Program code is required" });
  }

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
      "UPDATE program SET code = ?, program_name = ?, program_name_th = ?, year = ?, program_shortname_en = ?, program_shortname_th = ? WHERE program_id = ?",
      [
        code,
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
}

async function deleteOneById(req, res) {
  const { program_id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
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
  } finally {
    if (conn) conn.release();
  }
}

async function getManyFromPlo(req, res) {
  const { program_id } = req.query; // รับ program_id จาก query string
  let conn;
  if (!program_id) {
    return res
      .status(400)
      .json({ success: false, message: "Program ID is required" });
  }

  try {
    conn = await pool.getConnection(); // เชื่อมต่อกับฐานข้อมูล

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
  } finally {
    if (conn) conn.release();
  }
}

async function createOneByPlo(req, res) {
  const { program_id, plo_ids } = req.body;
  let conn;
  if (!program_id || !Array.isArray(plo_ids) || plo_ids.length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    conn = await pool.getConnection();
    const values = plo_ids.map((plo_id) => [program_id, plo_id]);
    await conn.query("INSERT INTO program_plo (program_id, plo_id) VALUES ?", [
      values,
    ]);
    res.status(201).json({ message: "Relationships added successfully" });
    conn.release();
  } catch (err) {
    console.error("Error adding relationships:", err);
    res.status(500).json({ message: "Database error" });
  } finally {
    if (conn) conn.release();
  }
}

async function deleteOneByPlo(req, res) {
  const { program_id, plo_id } = req.query;
  let conn;
  if (!program_id || !plo_id) {
    return res.status(400).json({ message: "Invalid data" });
  }
  const programId = parseInt(program_id);
  const ploId = parseInt(plo_id);
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `DELETE FROM program_plo WHERE program_id = ${programId} AND plo_id = ${ploId}`
    );
    // ตรวจสอบผลลัพธ์จากการลบ
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ success: true, message: "PLO removed successflly" });
    } else {
      res.status(404).json({ message: "PLO not found" });
    }
  } catch (err) {
    console.error("Error removing PLO:", err);
    res.status(500).json({ message: "Database error" });
    console.log("delete successed.");
  } finally {
    if (conn) conn.release();
  }
}

async function updateOneByPlo(req, res) {
  const { program_id, PLO_id, PLO_name, PLO_engname, PLO_code } = req.body; // เพิ่ม PLO_code
  let conn;
  if (!program_id || !PLO_id || !PLO_name || !PLO_engname) {
    return res.status(400).json({
      success: false,
      message:
        "Program ID, PLO ID, PLO name, and PLO English name are required",
    });
  }

  try {
    conn = await pool.getConnection();

    // ตรวจสอบว่า PLO_id นี้มีอยู่ในตาราง plo หรือไม่
    const ploExists = await conn.query(
      "SELECT PLO_id FROM plo WHERE PLO_id = ?",
      [PLO_id]
    );
    if (ploExists.length === 0) {
      return res.status(404).json({ success: false, message: "PLO not found" });
    }

    // อัปเดต PLO_name, PLO_engname และ PLO_code ในตาราง plo
    const result = await conn.query(
      `UPDATE plo 
             SET PLO_name = ?, PLO_engname = ?, PLO_code = ? 
             WHERE PLO_id = ?`,
      [PLO_name, PLO_engname, PLO_code, PLO_id]
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
  } finally {
    if (conn) conn.release();
  }
}

async function getProgramId(req, res) {
  const { program_name, program_year } = req.query;
  let conn;
  if (!program_name || !program_year) {
    return res.status(400).json({
      success: false,
      message: "Program name, year are required",
    });
  }
  try {
    conn = await pool.getConnection();
    const query = `SELECT program_id FROM program WHERE program_name="${program_name}" AND year=${program_year}`;
    const result = await conn.query(query);
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ success: false, message: "Database error" });
  } finally {
    if (conn) conn.release();
  }
}

async function createFromExcel(req, res) {
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

    const insertedPrograms = []; // เก็บข้อมูล programs ที่สร้างใหม่

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

      // เพิ่มข้อมูลในตาราง `program`
      const programQuery = `
        INSERT INTO program (
          code, program_name, program_name_th, year, program_shortname_en, program_shortname_th
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      const result = await conn.query(programQuery, [
        code,
        program_name,
        program_name_th,
        year,
        program_shortname_en,
        program_shortname_th,
      ]);

      console.log(result); // ตรวจสอบผลลัพธ์

      const program_id = result.insertId; // ดึง program_id ที่ถูกสร้างจากฐานข้อมูล

      // เชื่อมโยง program กับ faculty ผ่านตาราง `program_faculty`
      const programFacultyQuery = `
        INSERT INTO program_faculty (program_id, faculty_id) VALUES (?, ?)
      `;
      await conn.query(programFacultyQuery, [program_id, faculty_id]);

      // Fetch ข้อมูล program ที่เพิ่งสร้างขึ้น
      const fetchQuery = `SELECT * FROM program WHERE program_id = ?`;
      const fetchResult = await conn.query(fetchQuery, [program_id]);
      const newProgram = fetchResult[0];
      
      insertedPrograms.push(newProgram); // เพิ่มไปยัง array
    }

    await conn.commit();
    conn.release();
    
    // ส่งข้อมูล programs ที่สร้างใหม่กลับไป
    res.json({ 
      success: true, 
      message: "All rows inserted successfully",
      programs: insertedPrograms // ส่งข้อมูล programs ทั้งหมดที่สร้างใหม่
    });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("Error processing Excel upload:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
}

// async function getManyByFilter(req, res) {

// }

export {
  getPrograms,
  createOne,
  updateOneById,
  deleteOneById,
  getManyFromPlo,
  createOneByPlo,
  deleteOneByPlo,
  updateOneByPlo,
  getProgramId,
  createFromExcel,
};
