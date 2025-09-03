import express from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', authenticateToken, userController.getUsers);
router.get('/me', authenticateToken, userController.getProfile);
router.put('/me', authenticateToken, userController.updateProfile);
router.delete('/me', authenticateToken, userController.deleteProfile);

router.post('/:id/follow', authenticateToken, userController.followUser);
router.post('/:id/unfollow', authenticateToken, userController.unfollowUser);
router.post('/:id/request-follow', authenticateToken, userController.requestFollow);
router.post('/:id/accept-follow', authenticateToken, userController.acceptFollowRequest);
router.post('/:id/decline-follow', authenticateToken, userController.declineFollowRequest);
router.post('/:id/block', authenticateToken, userController.blockUser);
router.post('/:id/unblock', authenticateToken, userController.unblockUser);

router.put('/:id/role', authenticateToken, isAdmin, userController.setUserRole);
router.put('/:id/ban', authenticateToken, isAdmin, userController.banUser);
router.put('/:id/unban', authenticateToken, isAdmin, userController.unbanUser);

router.get('/:id/followers', authenticateToken, userController.getFollowers);
router.get('/:id/following', authenticateToken, userController.getFollowing);

export default router;