import express from 'express';
import { loginAdmin, logoutAdmin, refreshToken, registerAdmin } from '../controllers/auth.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, requireAdmin, logoutAdmin);

export default router;
