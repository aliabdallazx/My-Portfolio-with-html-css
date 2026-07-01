import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { getNotifications, markNotificationAsRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', authenticate, requireAdmin, getNotifications);
router.put('/:id/read', authenticate, requireAdmin, markNotificationAsRead);

export default router;
