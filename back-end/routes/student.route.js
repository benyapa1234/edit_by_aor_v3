import express from "express";
const router = express.Router();
import {
  insertStudent,
  getAll,
  deleteOne,
  saveScore,
  getStudentsByProgram,
  addStudent,
  updateStudent,
  deleteStudent,
  importStudentsFromExcel,
  getOneById,
  getStudentsByCourse,
} from "../controllers/student.controller.js";

router.post("/", insertStudent);
router.get("/", getAll);
router.delete("/:id", deleteOne);
router.post("/scores", saveScore);
router.post("/program/excel", importStudentsFromExcel);
router.get("/program", getStudentsByProgram);
router.post("/program", addStudent);
router.put("/program/:student_id", updateStudent);
router.delete("/program/:id", deleteStudent);
router.get("/:student_id", getOneById);
router.get("/course/:course_id/students", getStudentsByCourse);

export default router;
