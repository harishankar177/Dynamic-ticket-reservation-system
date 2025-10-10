import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ["admin", "tte", "passenger"], default: "passenger" },
  isActive: { type: Boolean, default: true },
  joinDate: { type: String, default: new Date().toISOString().split("T")[0] },
});

export default mongoose.model("User", userSchema);
