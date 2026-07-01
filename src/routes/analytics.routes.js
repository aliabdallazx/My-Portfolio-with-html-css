import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { getAnalyticsSummary, getLiveStats, recordVisitorEvent } from '../controllers/analytics.controller.js';

const router = express.Router();

router.post('/track', recordVisitorEvent);
router.get('/summary', authenticate, requireAdmin, getAnalyticsSummary);
router.get('/live', authenticate, requireAdmin, getLiveStats);

export default router;
