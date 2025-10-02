import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${email}: ${otp}`);

    // Save OTP for existing user or create temp record
    await User.updateOne({ email }, { otp }, { upsert: true });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not found" });
    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, name, email, phone, password, confirmPassword } = req.body;

    if (!username || !name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" });

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.password) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // If OTP was verified, update the record
    const user = await User.findOneAndUpdate(
      { email },
      { username, name, email, phone, password: hashedPassword, otp: null },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
