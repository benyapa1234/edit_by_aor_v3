import express from "express";
const router = express.Router();
import {
  getSections,
  getSemesters,
  getYearsByProgram,
} from "../controllers/metadata.controller.js";

router.get("/section", getSections);
router.get("/semesters", getSemesters);
router.get("/year", getYearsByProgram);

export default router;
