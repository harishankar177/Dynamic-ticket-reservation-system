import User from "../models/User.js";
import bcrypt from "bcrypt";

let otpStore = {}; // { email: otp }

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
otpStore[email] = otp;
console.log(`📩 OTP for ${email}: ${otp}`); // This logs OTP in the backend terminal

  return res.json({ success: true, message: "OTP sent (check server console)" });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email]; // clear after verify
    return res.json({ success: true });
  }
  return res.status(400).json({ error: "Invalid OTP" });
};

export const signup = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    return res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
