import express from 'express';
import * as categoryController from '../controllers/categoryController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', authenticateToken, isAdmin, categoryController.createCategory);
router.put('/:id', authenticateToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, isAdmin, categoryController.deleteCategory);

export default router;