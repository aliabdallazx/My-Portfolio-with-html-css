import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  bio: { type: String, required: true, trim: true },
  experience: { type: String, required: true, trim: true },
  education: { type: String, trim: true },
  languages: [{ type: String, trim: true }]
}, { timestamps: true });

export default mongoose.model('About', aboutSchema);
