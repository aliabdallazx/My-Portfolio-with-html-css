import Skill from '../models/Skill.js';
import Notification from '../models/Notification.js';
import { emitToAll } from '../sockets/socket.js';

export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    await Notification.create({
      type: 'skill_updated',
      title: 'Skill added',
      message: `Skill "${skill.name}" was added.`,
      metadata: { skillId: skill._id }
    });
    emitToAll('skill:updated', { skill });
    emitToAll('notification:new', { notification: { type: 'skill_updated', title: 'Skill added', message: `Skill "${skill.name}" was added.` } });
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (_req, res, next) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    await Notification.create({ type: 'skill_updated', title: 'Skill updated', message: `Skill "${skill.name}" was updated.`, metadata: { skillId: skill._id } });
    emitToAll('skill:updated', { skill });
    emitToAll('notification:new', { notification: { type: 'skill_updated', title: 'Skill updated', message: `Skill "${skill.name}" was updated.` } });
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
};
