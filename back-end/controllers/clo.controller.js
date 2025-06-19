import pool from "../utils/db.js";
import { success, error } from "../utils/response.js";
import xlsx from "xlsx";
import fs from "fs";

export async function getAll(req, res) {
  try {
    const query = `
      SELECT * FROM clo
    `;

    const [result] = await pool.query(query);
    success(res, result);
  } catch (err) {
    console.error("Error in getAll clo: ", err);
    error(res, "Error while fetching CLOs");
  }
}

export async function getOne(req, res) {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const query = `
      SELECT * FROM clo WHERE CLO_id = ?
    `;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "CLO not found" });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error("Erro in getOne clo: ", err);
    error(res, "Error while fetching CLO");
  }
}

export async function createOne(req, res) {
  const { clo_code, clo_name, clo_engname, course_id, year } = req.body;

  if (!clo_code || !clo_name || !clo_engname || !course_id || !year) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const checkQuery = `
      SELECT 1 FROM clo WHERE clo_code = ? AND course_id = ? AND year = ?
    `;
    const exists = await pool.query(checkQuery, [clo_code, course_id, year]);

    if (exists.length > 0) {
      return res
        .status(409)
        .json({ message: "CLO code already exists for this course." });
    }

    const insertQuery = `
      INSERT INTO clo (clo_code, clo_name, clo_engname, course_id, year)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await pool.query(insertQuery, [
      clo_code,
      clo_name,
      clo_engname,
      course_id,
      year,
    ]);

    res.status(201).json({
      message: "CLO created successfully",
      clo_id: Number(result.insertId),
    });
  } catch (err) {
    console.error("Error in createOne clo:", err);
    res.status(500).json({ message: "Error while creating CLO" });
  }
}

export async function updateOne(req, res) {
  const { id } = req.params;
  const { clo_code, clo_name, clo_engname } = req.body;

  if (!clo_code || !clo_name || !clo_engname) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM clo WHERE CLO_id = ?", [
      id,
    ]);
    if (!existing) {
      return res.status(404).json({ message: "CLO not found" });
    }

    const [duplicate] = await pool.query(
      "SELECT 1 FROM clo WHERE CLO_code = ? AND CLO_id != ?",
      [clo_code, id]
    );
    if (duplicate) {
      return res
        .status(409)
        .json({ message: "CLO code already exists for this course." });
    }

    const query = `
      UPDATE clo
      SET CLO_code = ?, CLO_name = ?, CLO_engname = ?
      WHERE CLO_id = ?
    `;
    await pool.query(query, [clo_code, clo_name, clo_engname, id]);

    res.json({ message: "CLO updated successfully" });
  } catch (err) {
    console.error("Error in updateOne clo:", err);
    res.status(500).json({ message: "Error while updating CLO" });
  }
}

export async function patchOne(req, res) {
  const { id } = req.params;
  const fields = req.body;

  if (!fields || Object.keys(fields).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const columns = Object.keys(fields)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(fields);
    values.push(id);

    const query = `UPDATE clo SET ${columns} WHERE CLO_id = ?`;
    const result = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "CLO not found" });
    }

    res.json({ message: "CLO updated partially" });
  } catch (err) {
    console.error("Error in patchOne clo:", err);
    res.status(500).json({ message: "Error while patching CLO" });
  }
}

export async function deleteOne(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM clo WHERE CLO_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "CLO not found" });
    }

    res.json({ message: "CLO deleted successfully" });
  } catch (err) {
    console.error("Error in deleteOne clo:", err);
    res.status(500).json({ message: "Error while deleting CLO" });
  }
}

export async function uploadExcel(req, res) {
  const { course_id, year } = req.query;

  try {
    const rawRows = req.body;
    const mapping = {
      CLO_code: "clo_code",
      CLO_name: "clo_name",
      CLO_engname: "clo_engname",
    };
    const rows = rawRows.map((row) => {
      const newRow = {};
      for (const key in row) {
        if (mapping[key]) {
          newRow[mapping[key]] = row[key];
        }
      }
      return newRow;
    });
    if (!rows || !rows.length) {
      return res.status(400).json({ message: "Empty or invalid Excel file." });
    }

    let inserted = 0;
    for (const row of rows) {
      const { clo_code, clo_name, clo_engname } = row;

      if (!clo_code || !clo_name || !clo_engname || !course_id || !year) {
        continue;
      }
      const exists = await pool.query(
        "SELECT 1 FROM clo WHERE CLO_code = ? AND course_id = ? AND year = ?",
        [clo_code, course_id, year]
      );
      if (exists.length > 0) continue;

      await pool.query(
        `INSERT INTO clo (CLO_code, CLO_name, CLO_engname, course_id, year)
         VALUES (?, ?, ?, ?, ?)`,
        [clo_code, clo_name, clo_engname, course_id, year]
      );
      inserted++;
    }
    res
      .status(201)
      .json({ message: `Imported ${inserted} CLOs successfully.` });
  } catch (error) {
    console.error("Error in uploadExcel:", error);
    res.status(500).json({ message: "Error while importing Excel" });
  }
}

export async function getByCourseId(req, res) {
  const { course_id, year } = req.query;

  try {
    const query = `
      SELECT * FROM clo WHERE course_id = ? AND year = ?
      ORDER BY CLO_code ASC
    `;

    const result = await pool.query(query, [course_id, year]);
    success(res, result);
  } catch (err) {
    console.error("Error in getByCourseId clo: ", err);
    error(res, "Error while fetching CLOs by course_id");
  }
}
