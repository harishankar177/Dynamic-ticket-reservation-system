// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

// In-memory OTP store — replace with DB or Redis in production
const otpStore = {}; // { email: { otp: "123456", expires: Date } }

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// nodemailer transporter (Gmail example) - fallback to console if not configured
const transporter = (() => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
  }
  return null;
})();

// POST /api/auth/send-otp
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = generateOtp();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore[email] = { otp, expires };
    console.log(`[OTP] ${email}: ${otp} (expires in 5m)`); // log to terminal for testing

    // send email if transporter available
    if (transporter) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Railbook OTP Verification",
        text: `Your Railbook OTP is ${otp}. It expires in 5 minutes.`
      });
    }

    // For testing, return OTP in response (remove in production)
    return res.json({ message: "OTP sent", otp }); 
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

    const record = otpStore[email];
    if (!record) return res.status(400).json({ error: "No OTP sent to this email" });
    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ error: "OTP expired" });
    }
    if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    delete otpStore[email]; // verified, remove
    return res.json({ success: true });
  } catch (err) {
    console.error("verify-otp:", err);
    return res.status(500).json({ error: "OTP verification failed" });
  }
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, name, email, phone, password, confirmPassword, role } = req.body;
    // Basic validations
    if (!username || !name || !email || !password || !confirmPassword)
      return res.status(400).json({ error: "Missing required fields" });
    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    // Prevent creation of admin/tte via public signup
    const allowedRole = role === "passenger" || !role ? "passenger" : null;
    if (!allowedRole) return res.status(403).json({ error: "Cannot create this role via signup" });

    // Check duplicates
    if (await User.findOne({ $or: [{ email }, { username }] }))
      return res.status(400).json({ error: "Email or username already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      username, name, email, phone,
      password: hashed, role: allowedRole
    });

    await user.save();
    return res.json({ message: "User created successfully" });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

// POST /api/auth/signin
router.post("/signin", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // sign JWT - adjust secret & expiry via env
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "jwtsecret", { expiresIn: "7d" });

    return res.json({
      message: "Signin success",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role, name: user.name }
    });
  } catch (err) {
    console.error("signin error:", err);
    return res.status(500).json({ error: "Signin failed" });
  }
});

export default router;
