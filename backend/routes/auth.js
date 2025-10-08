import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";

const router = express.Router();

// In-memory OTP store (for testing)
const otpStore = {};

// ===== HELPER: Check DB connection =====
const checkDBConnection = () => {
  return mongoose.connection.readyState === 1;
};

// ===== SIGNUP =====
router.post("/signup", async (req, res) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ error: "Database unavailable. Try later." });
    }

    const { username, name, email, phone, password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, name, email, phone, password: hashedPassword, role });
    await user.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ error: "Database unavailable. Try later." });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== SEND OTP =====
router.post("/send-otp", (req, res) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ error: "Database unavailable. Try later." });
    }

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = otp;

    console.log(`📩 OTP for ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent to terminal (testing mode)" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== VERIFY OTP =====
router.post("/verify-otp", (req, res) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ error: "Database unavailable. Try later." });
    }

    const { email, otp } = req.body;
    if (!otpStore[email]) return res.status(400).json({ error: "No OTP sent" });

    if (otpStore[email] !== otp) return res.status(400).json({ error: "Invalid OTP" });

    delete otpStore[email];
    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== FORGOT PASSWORD (SEND OTP) =====
router.post("/forgot-password/send-otp", async (req, res) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ error: "Database unavailable. Try later." });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = otp;

    console.log(`🔑 Forgot Password OTP for ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent to terminal (testing mode)" });
  } catch (err) {
    console.error("Forgot Password OTP Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== FORGOT PASSWORD (VERIFY OTP) =====
router.post("/forgot-password/verify-otp", (req, res) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ error: "Database unavailable. Try later." });
    }

    const { email, otp } = req.body;
    if (!otpStore[email]) return res.status(400).json({ error: "No OTP sent" });
    if (otpStore[email] !== otp) return res.status(400).json({ error: "Invalid OTP" });

    delete otpStore[email];
    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("Forgot Password Verify OTP Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== FORGOT PASSWORD (RESET) =====
router.post("/forgot-password/reset", async (req, res) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ error: "Database unavailable. Try later." });
    }

    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Forgot Password Reset Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
