import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { validateSkill } from '../middleware/validate.middleware.js';
import { createSkill, deleteSkill, getSkills, updateSkill } from '../controllers/skill.controller.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', authenticate, requireAdmin, validateSkill, createSkill);
router.put('/:id', authenticate, requireAdmin, validateSkill, updateSkill);
router.delete('/:id', authenticate, requireAdmin, deleteSkill);

export default router;
