import express from "express";
const router = express.Router();
import {
  createOne,
  deleteOne,
  getAll,
  getByCourseId,
  getOne,
  patchOne,
  updateOne,
  uploadExcel,
} from "../controllers/clo.controller.js";
import multer from "multer";

router.get("/", getAll);
router.get("/a/:id", getOne);
router.get("/course", getByCourseId);
router.post("/", createOne);
router.put("/:id", updateOne);
router.patch("/:id", patchOne);
router.delete("/:id", deleteOne);
router.post("/upload", uploadExcel);

export default router;
