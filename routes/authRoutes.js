import express from 'express';
import {
  register,
  login,
  sendMobileOTP,
  verifyMobileOTP,
  getMe,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-mobile-otp', sendMobileOTP);
router.post('/verify-mobile-otp', verifyMobileOTP);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

export default router;

