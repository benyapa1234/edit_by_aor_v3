import express from "express";
import {
  addManyFromExcel,
  getAllCourse,
  getAllStudentFromCourse,
} from "../controllers/student_course.controller.js";
const router = express.Router();

router.post("/", addManyFromExcel);
router.get("/course/:student_id", getAllCourse);
router.get("/student", getAllStudentFromCourse);

export default router;
