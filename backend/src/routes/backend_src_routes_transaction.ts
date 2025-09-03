import express from 'express';
import * as transactionController from '../controllers/transactionController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, transactionController.getTransactions);
router.post('/', authenticateToken, transactionController.createTransaction);
router.get('/:id', authenticateToken, transactionController.getTransactionById);
router.put('/:id', authenticateToken, transactionController.updateTransaction);
router.delete('/:id', authenticateToken, transactionController.deleteTransaction);

router.post('/:id/mark-completed', authenticateToken, transactionController.markCompleted);
router.post('/:id/mark-canceled', authenticateToken, transactionController.markCanceled);
router.post('/:id/mark-disputed', authenticateToken, transactionController.markDisputed);

router.post('/:id/admin-action', authenticateToken, isAdmin, transactionController.adminAction);

export default router;