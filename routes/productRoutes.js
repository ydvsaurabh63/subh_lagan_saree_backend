import express from 'express';
import {
  getProducts,
  getProductByIdentifier,
  getRelatedProducts,
  getFilterOptions,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/filters/options', getFilterOptions);
router.get('/:identifier', getProductByIdentifier);
router.get('/:id/related', getRelatedProducts);

// Admin-only protected routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;

