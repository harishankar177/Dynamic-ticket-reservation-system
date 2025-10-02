// routes/auth.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ================= SEND OTP =================
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.password) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB (if user exists, update; else create)
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, otp, otpExpires: Date.now() + 5 * 60 * 1000 });
    } else {
      user.otp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min expiry
    }
    await user.save();

    console.log(`OTP for ${email}: ${otp}`); // show OTP in terminal
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not found" });
    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ error: "OTP expired" });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during OTP verification" });
  }
});

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { username, name, email, phone, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otp) return res.status(400).json({ error: "OTP not verified" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user details
    user.username = username;
    user.name = name;
    user.phone = phone;
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});

export default router;
