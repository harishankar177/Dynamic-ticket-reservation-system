// db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Railbook", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected to Railbook DB ✅");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;
