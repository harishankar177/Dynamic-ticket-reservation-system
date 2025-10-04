// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Example protected routes
import { authenticate, permit } from "./middleware/auth.js";

app.get("/api/passenger/dashboard", authenticate, permit("passenger"), (req, res) => {
  res.json({ message: "Passenger dashboard data" });
});
app.get("/api/tte/dashboard", authenticate, permit("tte"), (req, res) => {
  res.json({ message: "TTE dashboard data" });
});
app.get("/api/admin/dashboard", authenticate, permit("admin"), (req, res) => {
  res.json({ message: "Admin dashboard data" });
});

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/Railbook";

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log(`Server running ${PORT}`));
  }).catch(err => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });
