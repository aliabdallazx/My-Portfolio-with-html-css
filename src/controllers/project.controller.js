import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import { emitToAll } from '../sockets/socket.js';

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    await Notification.create({
      type: 'project_updated',
      title: 'New project created',
      message: `Project "${project.title}" was created.`,
      metadata: { projectId: project._id }
    });
    emitToAll('project:updated', { project });
    emitToAll('notification:new', { notification: { type: 'project_updated', title: 'New project created', message: `Project "${project.title}" was created.` } });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (_req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await Notification.create({
      type: 'project_updated',
      title: 'Project updated',
      message: `Project "${project.title}" was updated.`,
      metadata: { projectId: project._id }
    });

    emitToAll('project:updated', { project });
    emitToAll('notification:new', { notification: { type: 'project_updated', title: 'Project updated', message: `Project "${project.title}" was updated.` } });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
