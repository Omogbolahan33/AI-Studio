import express from 'express';
import * as addressController from '../controllers/addressController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, addressController.getAddresses);
router.post('/', authenticateToken, addressController.addAddress);
router.put('/:id', authenticateToken, addressController.updateAddress);
router.delete('/:id', authenticateToken, addressController.deleteAddress);

export default router;