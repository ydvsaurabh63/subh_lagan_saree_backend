import express from 'express';
import {
  getStoreBySlug,
  getStoreByDomain,
  getDefaultStore,
  getAllStores,
  createStore,
  updateStore,
  deleteStore,
} from '../controllers/storeController.js';
import { protect, superAdminOnly, adminOrSuperAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/default', getDefaultStore);
router.get('/by-domain/:domain', getStoreByDomain);
router.get('/by-slug/:slug', getStoreBySlug);
router.get('/', getAllStores);

// Protected management routes
router.post('/', protect, adminOrSuperAdminOnly, createStore);
router.put('/:id', protect, adminOrSuperAdminOnly, updateStore);
router.delete('/:id', protect, superAdminOnly, deleteStore);

export default router;

