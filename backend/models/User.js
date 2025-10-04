// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String },
  password: { type: String, required: true },
  role:     { type: String, enum: ["passenger","tte","admin"], default: "passenger" },
  createdAt:{ type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
