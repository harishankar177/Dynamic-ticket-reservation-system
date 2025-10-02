// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String },
  otp: { type: String },           // Store OTP
  otpExpires: { type: Date },      // Expiry time for OTP
});

export default mongoose.model("User", userSchema);
