import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// Utility: generate unique Booking ID (PNR-like)
function generateBookingId() {
  const prefix = 'RBK';
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `${prefix}${randomDigits}`;
}

// ✅ POST - Store booking data in MongoDB
router.post('/', async (req, res) => {
  try {
    // Auto-generate bookingId (PNR)
    const bookingId = generateBookingId();

    // Merge bookingId into the data sent from frontend
    const bookingData = { ...req.body, bookingId };

    // Save to MongoDB
    const booking = new Booking(bookingData);
    await booking.save();

    res.status(201).json({
      message: 'Booking stored successfully',
      bookingId,
      booking,
    });
  } catch (err) {
    console.error('❌ Booking save error:', err);
    res.status(500).json({
      message: 'Failed to store booking',
      error: err.message,
    });
  }
});

export default router;
