import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['read', 'unread'], default: 'unread' }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
