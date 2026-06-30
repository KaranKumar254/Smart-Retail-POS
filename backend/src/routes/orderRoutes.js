import express from 'express';
import {
  getOrders,
  getOrderById,
  checkoutOrder,
  updateOrderStatus,
  getRecentTransactions,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getOrders);
router.get('/recent', getRecentTransactions);
router.post('/checkout', checkoutOrder);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;
