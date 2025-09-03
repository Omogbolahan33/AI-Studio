import express from 'express';
import * as postController from '../controllers/postController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', postController.getPosts);
router.post('/', authenticateToken, postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', authenticateToken, postController.updatePost);
router.delete('/:id', authenticateToken, postController.deletePost);

router.post('/:id/like', authenticateToken, postController.likePost);
router.post('/:id/dislike', authenticateToken, postController.dislikePost);
router.post('/:id/pin', authenticateToken, isAdmin, postController.pinPost);
router.post('/:id/unpin', authenticateToken, isAdmin, postController.unpinPost);

router.post('/:id/flag', authenticateToken, postController.flagPost);
router.post('/:id/unflag', authenticateToken, isAdmin, postController.unflagPost);
router.post('/:id/resolve-flag', authenticateToken, isAdmin, postController.resolveFlag);

export default router;