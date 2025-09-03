import express from "express";
import { authenticateToken } from "../middleware/auth";
import * as messageController from "../controllers/messageController";

const router = express.Router();

router.get("/", authenticateToken, messageController.getAllMessages);
router.get("/:id", authenticateToken, messageController.getMessageById);
router.post("/", authenticateToken, messageController.createMessage);
router.delete("/:id", authenticateToken, messageController.deleteMessage);

export default router;