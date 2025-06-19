import express from "express";
const router = express.Router();
import { login, verifyToken } from "../controllers/auth.controller.js";

router.post("/login", login);
router.get("/verify-token", verifyToken);

export default router;
