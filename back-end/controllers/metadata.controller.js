import pool from "../utils/db.js";

async function getSections(req, res) {
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
}
async function getSemesters(req, res) {
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
}
async function getYearsByProgram(req, res) {
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
}

export { getSections, getSemesters, getYearsByProgram };
