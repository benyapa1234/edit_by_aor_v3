import express from "express";
import {
  getAll,
  insertOne,
  getFaculty,
  addProgramFaculty,
} from "../controllers/university.controller.js";
const router = express.Router();

router.get("/", getAll);
router.post("/", insertOne);
router.get("/faculty/:university_id", getFaculty);
router.post("/program-faculty", addProgramFaculty);

export default router;
