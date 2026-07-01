import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { validateProject } from '../middleware/validate.middleware.js';
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from '../controllers/project.controller.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authenticate, requireAdmin, validateProject, createProject);
router.put('/:id', authenticate, requireAdmin, validateProject, updateProject);
router.delete('/:id', authenticate, requireAdmin, deleteProject);

export default router;
