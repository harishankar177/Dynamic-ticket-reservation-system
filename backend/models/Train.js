import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'maintenance'], default: 'active' },
  isRunning: { type: Boolean, default: false },
  departureTime: { type: String },
  arrivalTime: { type: String },
  // embedded route stops
  routes: [
    {
      stopName: { type: String },
      arrival: { type: String },
      departure: { type: String },
    },
  ],
  // coaches and seat availability
  coaches: [
    {
      type: { type: String },
      count: { type: Number, default: 0 },
      seatsAvailable: { type: Number, default: 0 },
    },
  ],
}, { timestamps: true });

export default mongoose.model('Train', trainSchema);
