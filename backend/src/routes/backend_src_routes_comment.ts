import express from 'express';
import * as commentController from '../controllers/commentController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/:postId', authenticateToken, commentController.addComment);
router.put('/:postId/:commentId', authenticateToken, commentController.editComment);
router.delete('/:postId/:commentId', authenticateToken, commentController.deleteComment);

router.post('/:postId/:commentId/flag', authenticateToken, commentController.flagComment);
router.post('/:postId/:commentId/unflag', authenticateToken, isAdmin, commentController.unflagComment);
router.post('/:postId/:commentId/resolve-flag', authenticateToken, isAdmin, commentController.resolveFlag);

export default router;