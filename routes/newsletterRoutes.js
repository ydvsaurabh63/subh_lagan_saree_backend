import express from 'express';
import {
  subscribeNewsletter,
  getAllSubscribers,
} from '../controllers/newsletterController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', subscribeNewsletter);
router.get('/admin/all', protect, adminOnly, getAllSubscribers);

export default router;

