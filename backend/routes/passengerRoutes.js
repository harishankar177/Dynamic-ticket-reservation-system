import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// Return all passengers from all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();

    const passengers = bookings.flatMap((booking) =>
      booking.passengers.map((p, index) => ({
        passengerId: booking._id + "_" + index, // unique ID
        bookingId: booking.bookingId,
        trainName: booking.trainName,
        trainNumber: booking.trainNumber,
        email: booking.email,
        phone: booking.phone,

        // from passenger array
        name: p.name,
        age: p.age,
        gender: p.gender,
        seatNumber: p.seatNumber,
        coachNumber: p.coachNumber,

        // optional
        bookingStatus: "CNF",
        attendanceStatus: "unchecked",
        from: p.from || "—",
        to: p.to || "—"
      }))
    );

    res.json(passengers);
  } catch (error) {
    console.error("Error fetching passengers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
