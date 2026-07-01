import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import { emitToAll } from '../sockets/socket.js';

export const createMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    await Notification.create({
      type: 'message_received',
      title: 'New message received',
      message: `A new message was received from ${message.name}.`,
      metadata: { messageId: message._id }
    });
    emitToAll('message:new', { message });
    emitToAll('notification:new', { notification: { type: 'message_received', title: 'New message received', message: `A new message was received from ${message.name}.` } });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (_req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

export const updateMessageStatus = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};
