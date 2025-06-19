import express from "express";
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/account.controller.js";

const router = express.Router();

router.get("/", getAllAccounts);
router.get("/:id", getAccountById);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

export default router;
