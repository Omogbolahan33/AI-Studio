import express from "express";
import { authenticateToken } from "../middleware/auth";
import * as bankAccountController from "../controllers/bankAccountController";

const router = express.Router();

router.get("/", authenticateToken, bankAccountController.getAllBankAccounts);
router.get("/:id", authenticateToken, bankAccountController.getBankAccountById);
router.post("/", authenticateToken, bankAccountController.createBankAccount);
router.put("/:id", authenticateToken, bankAccountController.updateBankAccount);
router.delete("/:id", authenticateToken, bankAccountController.deleteBankAccount);

export default router;