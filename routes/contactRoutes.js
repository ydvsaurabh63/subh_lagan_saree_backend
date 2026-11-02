import express from 'express';
import {
  submitContactMessage,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public submission
router.post('/', submitContactMessage);

// Admin-only routes
router.get('/admin/all', protect, adminOnly, getAllContacts);
router.put('/admin/:id/status', protect, adminOnly, updateContactStatus);
router.delete('/admin/:id', protect, adminOnly, deleteContact);

export default router;

