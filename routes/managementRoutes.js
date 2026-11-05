import express from 'express';
import {
  getSuperAdminStats,
  getAdminPortalStats,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  toggleUserStatus,
} from '../controllers/managementController.js';
import { protect, superAdminOnly, adminOrSuperAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All management routes require authenticated token
router.use(protect);

// -------------------------------------------------------------
// SUPERADMIN EXCLUSIVE ROUTES
// -------------------------------------------------------------
router.get('/superadmin/stats', superAdminOnly, getSuperAdminStats);

router.get('/admins', superAdminOnly, getAdmins);
router.post('/admins', superAdminOnly, createAdmin);
router.put('/admins/:id', superAdminOnly, updateAdmin);
router.delete('/admins/:id', superAdminOnly, deleteAdmin);

// -------------------------------------------------------------
// ADMIN & SUPERADMIN ROUTES
// -------------------------------------------------------------
router.get('/admin/stats', adminOrSuperAdminOnly, getAdminPortalStats);

router.get('/clients', adminOrSuperAdminOnly, getClients);
router.post('/clients', adminOrSuperAdminOnly, createClient);
router.put('/clients/:id', adminOrSuperAdminOnly, updateClient);
router.delete('/clients/:id', adminOrSuperAdminOnly, deleteClient);

router.put('/users/:id/toggle-status', adminOrSuperAdminOnly, toggleUserStatus);

export default router;

