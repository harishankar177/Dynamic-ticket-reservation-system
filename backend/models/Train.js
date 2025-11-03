import mongoose from 'mongoose';

const routeStopSchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  arrival: { type: String },       // e.g., "08:45"
  departure: { type: String },     // e.g., "09:00"
  haltDuration: { type: String },  // optional — e.g., "15 min"
  distanceFromStart: { type: Number, default: 0 }, // optional — in km
});

const coachSchema = new mongoose.Schema({
  type: { type: String, required: true },  // e.g., "Sleeper", "3AC"
  count: { type: Number, default: 0 },
  seatsAvailable: { type: Number, default: 0 },
  price: { type: Number, default: 0 }, // 💰 New field for ticket price
});

const trainSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    number: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'maintenance'],
      default: 'active',
    },
    isRunning: { type: Boolean, default: false },
    departureTime: { type: String },
    arrivalTime: { type: String },

    // Route details (list of stops)
    routes: [routeStopSchema],

    // Coaches and pricing
    coaches: [coachSchema],
  },
  { timestamps: true }
);

// Save under Railbook DB
export default mongoose.model('Train', trainSchema, 'trains');
