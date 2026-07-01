import About from '../models/About.js';
import Notification from '../models/Notification.js';
import { emitToAll } from '../sockets/socket.js';

export const getAbout = async (_req, res, next) => {
  try {
    const about = await About.findOne();
    res.json({ success: true, data: about });
  } catch (error) {
    next(error);
  }
};

export const updateAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create(req.body);
    } else {
      about = await About.findByIdAndUpdate(about._id, req.body, { new: true, runValidators: true });
    }

    await Notification.create({ type: 'cms_change', title: 'About section updated', message: 'About section content was updated.', metadata: { section: 'about' } });
    emitToAll('notification:new', { notification: { type: 'cms_change', title: 'About section updated', message: 'About section content was updated.' } });
    res.json({ success: true, data: about });
  } catch (error) {
    next(error);
  }
};
