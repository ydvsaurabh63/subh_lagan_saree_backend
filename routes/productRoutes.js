import express from 'express';
import {
  getProducts,
  getProductByIdentifier,
  getRelatedProducts,
  getFilterOptions,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/filters/options', getFilterOptions);
router.get('/:identifier', getProductByIdentifier);
router.get('/:id/related', getRelatedProducts);

export default router;

