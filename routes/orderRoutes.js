import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Customer routes
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin-only order management routes
router.get('/admin/all', adminOnly, getAllOrdersAdmin);
router.put('/admin/:id/status', adminOnly, updateOrderStatusAdmin);
router.delete('/admin/:id', adminOnly, deleteOrderAdmin);

export default router;

