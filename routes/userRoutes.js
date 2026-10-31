import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAddresses,
  addAddress,
  deleteAddress,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect); // All user profile routes are protected

router.get('/profile', getUserProfile);
router.put('/profile', upload.single('profileImage'), updateUserProfile);
router.put('/change-password', changePassword);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;

