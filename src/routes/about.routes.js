import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { getAbout, updateAbout } from '../controllers/about.controller.js';

const router = express.Router();

router.get('/', getAbout);
router.put('/', authenticate, requireAdmin, updateAbout);

export default router;
