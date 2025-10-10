import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create user
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, role, isActive, joinDate } = req.body;
    const user = new User({ name, email, phone, role, isActive, joinDate });
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Add User Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.json(user);
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
