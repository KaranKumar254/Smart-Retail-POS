import express from 'express';
import {
  getInventory,
  getInventorySummary,
  adjustStock,
  getInventoryLogs,
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getInventory);
router.get('/summary', getInventorySummary);
router.get('/:productId/logs', getInventoryLogs);
router.put('/:productId/stock', authorize('Admin', 'Manager'), adjustStock);

export default router;
