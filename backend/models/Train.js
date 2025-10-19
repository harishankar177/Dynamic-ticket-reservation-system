import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'maintenance'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Train', trainSchema);
