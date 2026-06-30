import express from 'express';
import {
  getStatCards,
  getRevenueTrend,
  getSalesChannelSplit,
  getReportHighlights,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getStatCards);
router.get('/revenue', getRevenueTrend);
router.get('/sales-channel', getSalesChannelSplit);
router.get('/report-highlights', getReportHighlights);

export default router;
