import Analytics from '../models/Analytics.js';
import Notification from '../models/Notification.js';
import Project from '../models/Project.js';
import { emitToAll } from '../sockets/socket.js';

export const recordVisitorEvent = async (req, res, next) => {
  try {
    const { page, projectId, visitorId: bodyVisitorId } = req.body;
    const visitorId = bodyVisitorId || req.headers['x-visitor-id'] || req.ip;
    const commonData = {
      page,
      visitorId,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      metadata: {}
    };

    await Analytics.create({ ...commonData, eventType: 'visitor' });
    await Analytics.create({ ...commonData, eventType: 'page_view' });

    if (projectId) {
      await Analytics.create({ ...commonData, eventType: 'project_view', projectId });
    }

    const notification = await Notification.create({
      type: 'new_visitor',
      title: 'New visitor',
      message: 'A new visitor interacted with your portfolio.',
      metadata: { page, visitorId }
    });

    emitToAll('visitor:new', { visitorId, page });
    emitToAll('notification:new', { notification });

    res.status(201).json({ success: true, message: 'Visitor event recorded' });
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsSummary = async (_req, res, next) => {
  try {
    const totalVisitors = (await Analytics.distinct('visitorId')).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyVisitors = (await Analytics.find({ createdAt: { $gte: today } }).distinct('visitorId')).length;
    const pageViews = await Analytics.countDocuments({ eventType: 'page_view' });
    const projects = await Project.find().lean();
    const mostViewedProjects = await Analytics.aggregate([
      { $match: { eventType: 'project_view' } },
      { $group: { _id: '$projectId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const enriched = await Promise.all(mostViewedProjects.map(async (item) => {
      const project = await Project.findById(item._id).lean();
      return { ...item, project };
    }));

    res.json({ success: true, data: { totalVisitors, dailyVisitors, pageViews, mostViewedProjects: enriched, projects } });
  } catch (error) {
    next(error);
  }
};

export const getLiveStats = async (_req, res, next) => {
  try {
    const totalVisitors = await Analytics.distinct('visitorId').countDocuments();
    const recentEvents = await Analytics.find().sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: { totalVisitors, recentEvents } });
  } catch (error) {
    next(error);
  }
};
