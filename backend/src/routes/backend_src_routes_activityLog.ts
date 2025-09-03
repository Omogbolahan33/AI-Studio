import express from 'express';
import * as activityLogController from '../controllers/activityLogController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/user/:userId', authenticateToken, activityLogController.getUserActivityLog);

export default router;