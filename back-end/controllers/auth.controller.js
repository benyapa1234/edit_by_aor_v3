import pool from "../utils/db.js";
import jwt from "jsonwebtoken";

async function login(req, res) {
  const { email, token } = req.body;

  try {
    const conn = await pool.getConnection();

    // ตรวจสอบว่าอีเมลมีอยู่ในฐานข้อมูลหรือไม่
    const results = await conn.query("SELECT role FROM role WHERE email = ?", [
      email,
    ]);

    let role;
    if (results.length > 0) {
      // ถ้าอีเมลมีอยู่ ดึงบทบาท (role)
      role = results[0].role;
    } else {
      // ถ้าอีเมลไม่มีอยู่ เพิ่มผู้ใช้ใหม่ด้วยบทบาทเริ่มต้น
      const defaultRole = "Student";
      await conn.query("INSERT INTO role (email, role) VALUES (?, ?)", [
        email,
        defaultRole,
      ]);
      role = defaultRole;
    }

    // สร้าง JWT token ที่มีอายุยาวนาน
    const jwtToken = jwt.sign(
      { email, role },
      "958902418959-llvaof6d4td6cicvdd27fltshv63rudo.apps.googleusercontent.com",
      { expiresIn: "1d" }
    );

    // เก็บ JWT ใน cookie ที่มีอายุยาวนาน
    res.cookie("auth_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });

    // ส่งข้อมูลกลับไปยัง frontend รวมถึง token สำหรับเก็บใน localStorage
    res.json({
      success: true,
      role,
      token: jwtToken,
    });

    conn.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
}

async function verifyToken(req, res) {
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
}

export { login, verifyToken };
