import express from "express";
const router = express.Router();
import {
  getPrograms,
  createOne,
  updateOneById,
  deleteOneById,
  getManyFromPlo,
  createOneByPlo,
  deleteOneByPlo,
  updateOneByPlo,
  getProgramId,
  createFromExcel,
} from "../controllers/program.controller.js";

router.get("/", getPrograms);
router.post("/", createOne);
router.put("/:program_id/update", updateOneById);
router.delete("/:program_id/delete", deleteOneById);
router.get("/plo", getManyFromPlo);
router.post("/plo", createOneByPlo);
router.delete("/plo", deleteOneByPlo);
router.put("/plo", updateOneByPlo);
router.get("/id", getProgramId);
router.post("/excel", createFromExcel);


export default router;
