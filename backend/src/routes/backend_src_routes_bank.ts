import express from 'express';
import * as bankController from '../controllers/bankController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, bankController.getBankAccounts);
router.post('/', authenticateToken, bankController.addBankAccount);
router.put('/:id', authenticateToken, bankController.updateBankAccount);
router.delete('/:id', authenticateToken, bankController.deleteBankAccount);

export default router;