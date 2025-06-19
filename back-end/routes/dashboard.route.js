import express from "express";
const router = express.Router();
import {
  getAvgReport,
  getStudentCLOReport,
} from "../controllers/dashboard.controller.js";

router.get("/:student_id/clo-report", getStudentCLOReport);
router.get("/:program_id/report", getAvgReport);

export default router;
