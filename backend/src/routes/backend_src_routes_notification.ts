import express from 'express';
import * as notificationController from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, notificationController.getNotifications);
router.post('/:id/read', authenticateToken, notificationController.markAsRead);
router.post('/:id/unread', authenticateToken, notificationController.markAsUnread);
router.delete('/:id', authenticateToken, notificationController.deleteNotification);

export default router;