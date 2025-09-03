import express from 'express';
import * as chatController from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, chatController.getChats);
router.post('/', authenticateToken, chatController.createChat);
router.get('/:id', authenticateToken, chatController.getChatById);
router.post('/:id/message', authenticateToken, chatController.sendMessage);
router.post('/:id/forward', authenticateToken, chatController.forwardMessage);
router.post('/:id/save-sticker', authenticateToken, chatController.saveSticker);

export default router;