import pool from "../utils/db.js";

// Get all roles
export const getAllAccounts = async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM role");

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // แปลง BigInt เป็น String
    const formattedRows = rows.map((row) => ({
      ...row,
      id: row.id.toString(), // หรือใช้ Number(row.id) ถ้าต้องการ
    }));
    res.status(200).json(formattedRows);
  } catch (err) {
    console.error("Database error:", err); // Log ข้อผิดพลาด
    res
      .status(500)
      .json({ message: "Database error", error: err.message || err });
  }
};

// Get a specific role by ID
export const getAccountById = async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await pool.query("SELECT * FROM role WHERE id = ?", [id]);
    const formattedRows = rows.map((row) => ({
      ...row,
      id: row.id.toString(), // หรือใช้ Number(row.id) ถ้าต้องการ
    }));
    res.status(200).json(formattedRows);
    if (formattedRows.length === 0)
      return res.status(404).json({ message: "Account not found" });
    res.status(200).json(formattedRows[0]);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Create new account
export const createAccount = async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role)
    return res.status(400).json({ message: "Email and role are required" });
  try {
    const conn = await pool.getConnection();
    await conn.query("INSERT INTO role (email, role) VALUES (?, ?)", [
      email,
      role,
    ]);
    conn.release();
    res.status(201).json({ message: "Account created" });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};

export const updateAccount = async (req, res) => {
  let { id } = req.params;
  const { role } = req.body;
  const result = await pool.query(`UPDATE role SET role = ? WHERE id = ${id}`, [
    role,
  ]);
  res.status(200).json({ message: "Update successfully" });
};

export const deleteAccount = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM role WHERE id = ?", [id]);
  res.status(200).json({ message: "Delete successfully" });
};
