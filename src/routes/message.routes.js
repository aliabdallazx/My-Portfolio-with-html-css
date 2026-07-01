import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { validateMessage } from '../middleware/validate.middleware.js';
import { createMessage, deleteMessage, getMessages, updateMessageStatus } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/', validateMessage, createMessage);
router.get('/', authenticate, requireAdmin, getMessages);
router.put('/:id', authenticate, requireAdmin, updateMessageStatus);
router.delete('/:id', authenticate, requireAdmin, deleteMessage);

export default router;
