import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  email: String,
  phone: String,
});

const seatSchema = new mongoose.Schema({
  coach: String,
  seatNumber: String,
  class: String,
});

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  selectedTrain: Object,
  selectedSeats: [seatSchema],
  passengers: [passengerSchema],
  totalAmount: Number,
  searchData: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Booking', bookingSchema);
