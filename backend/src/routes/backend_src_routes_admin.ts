import express from 'express';
import * as adminController from '../controllers/adminController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/flags', authenticateToken, isAdmin, adminController.getAllFlags);
router.get('/activity', authenticateToken, isAdmin, adminController.getAllActivityLogs);
router.get('/users', authenticateToken, isAdmin, adminController.getAllUsers);
router.get('/transactions', authenticateToken, isAdmin, adminController.getAllTransactions);

export default router;