import express from "express";
const router = express.Router();
import {
  getManyByProgram,
  createOne,
  createFromExcel,
  savePloCloMappings,
  getMapping,
} from "../controllers/plo.controller.js";

router.get("/", getManyByProgram);
router.post("/", createOne);
router.post("/excel", createFromExcel);
router.post("/save", savePloCloMappings);
router.get("/mapping", getMapping);

export default router;
