import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  trainName: { type: String, required: true },
  trainNumber: { type: String, required: true },
  passengers: { type: Array, required: true },
  seats: { type: Array, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  paymentStatus: { type: String, default: "Paid" },
  amountPaid: { type: Number, required: true },

  // 🔹 Make optional
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
},
{ timestamps: true });

export default mongoose.model("Booking", BookingSchema);
