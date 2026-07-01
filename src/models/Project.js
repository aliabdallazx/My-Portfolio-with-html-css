import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  technologies: [{ type: String, trim: true }],
  githubLink: { type: String, trim: true },
  liveDemoLink: { type: String, trim: true },
  images: [{ type: String, trim: true }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
