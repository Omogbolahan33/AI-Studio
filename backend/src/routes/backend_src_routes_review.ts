import express from 'express';
import * as reviewController from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/user/:userId', reviewController.getUserReviews);
router.post('/user/:userId', authenticateToken, reviewController.addReview);

export default router;