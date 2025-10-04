// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token" });
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || "jwtsecret");
    req.user = payload; // { id, role }
    // optionally attach full user
    req.userDoc = await User.findById(payload.id).select("-password");
    next();
  } catch (err) {
    console.error("auth failed", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const permit = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
  next();
};
