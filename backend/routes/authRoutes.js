const express = require("express");
const router = express.Router();

// Example login route
router.post("/login", (req, res) => {
  res.json({ message: "Login API working!" });
});

// Example register route
router.post("/register", (req, res) => {
  res.json({ message: "Register API working!" });
});

module.exports = router;
