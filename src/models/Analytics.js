import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  eventType: { type: String, required: true, enum: ['visitor', 'page_view', 'project_view', 'message_received'] },
  page: { type: String, trim: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  visitorId: { type: String, trim: true },
  ip: { type: String, trim: true },
  userAgent: { type: String, trim: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

analyticsSchema.index({ createdAt: -1 });

export default mongoose.model('Analytics', analyticsSchema);
