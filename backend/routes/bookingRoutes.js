// routes/bookingRoutes.js
import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// CREATE NEW BOOKING API
router.post("/create", async (req, res) => {
  try {
    const bookingData = req.body;

    // Generate unique booking ID
    const bookingId = "RB" + Math.floor(100000 + Math.random() * 900000);

    // Save to database
    const newBooking = new Booking({ ...bookingData, bookingId });
    await newBooking.save();

    return res.status(201).json({
      message: "Booking saved successfully",
      bookingId,
      data: newBooking,
    });
  } catch (error) {
    console.error("❌ Booking save error:", error);
    res.status(500).json({ message: "Error saving booking", error });
  }
});

// GET ALL BOOKINGS
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", err });
  }
});

// GET BOOKING BY BOOKING ID
router.get("/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking", err });
  }
});

export default router;
