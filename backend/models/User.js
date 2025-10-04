import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['passenger', 'TTE', 'admin'], default: 'passenger' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
