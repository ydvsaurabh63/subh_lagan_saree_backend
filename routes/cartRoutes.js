import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  syncGuestCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/item/:productId', updateCartItem);
router.delete('/item/:productId', removeFromCart);
router.post('/sync', syncGuestCart);
router.delete('/', clearCart);

export default router;

