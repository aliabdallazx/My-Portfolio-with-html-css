import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['message_received', 'project_updated', 'new_visitor', 'skill_updated', 'cms_change'], required: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
