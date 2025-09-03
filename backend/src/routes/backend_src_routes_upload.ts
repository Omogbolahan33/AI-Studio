import express from 'express';
import * as uploadController from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/media', authenticateToken, uploadController.uploadMedia);

export default router;