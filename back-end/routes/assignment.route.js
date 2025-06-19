import express from "express";
import {
  assignStudent,
  createOne,
  deleteOneById,
  getAll,
  getAssignmentClos,
  getManyByProgramCourse,
  getManyWithScore,
  updateScore,
} from "../controllers/assignment.controller.js";
const router = express.Router();

router.get("/", getAll);
router.post("/", createOne);
router.delete("/:assignment_id", deleteOneById);
router.get("/:program_course_id", getManyByProgramCourse);
router.post("/assign", assignStudent);
router.get("/score/:assignment_id", getManyWithScore);
router.post("/score", updateScore);
router.get("/clos/:assignment_id", getAssignmentClos);
// router.put("/clos/:assignment_id", updateAssignmentClos);

export default router;
