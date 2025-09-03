import express from 'express';
import * as disputeController from '../controllers/disputeController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, disputeController.getDisputes);
router.post('/', authenticateToken, disputeController.createDispute);
router.get('/:id', authenticateToken, disputeController.getDisputeById);
router.put('/:id', authenticateToken, disputeController.updateDispute);
router.post('/:id/message', authenticateToken, disputeController.addMessage);
router.post('/:id/resolve', authenticateToken, isAdmin, disputeController.resolveDispute);

export default router;