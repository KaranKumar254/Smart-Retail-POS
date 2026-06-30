import express from 'express';
import {
  getProducts,
  getProductById,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/barcode/:barcode', getProductByBarcode);
router.get('/:id', getProductById);
router.post('/', authorize('Admin', 'Manager'), createProduct);
router.put('/:id', authorize('Admin', 'Manager'), updateProduct);
router.delete('/:id', authorize('Admin', 'Manager'), deleteProduct);

export default router;
