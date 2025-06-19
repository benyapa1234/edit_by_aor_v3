import express from "express";
const router = express.Router();
import {
  getAll,
  createOne,
  updateOneById,
  deleteOneById,
  getManyByFilter,
  importCoursesFromExcel,
  getOneById,
} from "../controllers/course.controller.js";

router.get("/", getAll);
router.get("/filter", getManyByFilter);
router.get("/:course_id", getOneById);
router.post("/", createOne);
router.put("/:course_id", updateOneById);
router.delete("/:course_id", deleteOneById);
router.post("/excel", importCoursesFromExcel);

export default router;
