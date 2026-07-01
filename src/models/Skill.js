import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ['frontend', 'backend', 'AI', 'tools'], required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' }
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
