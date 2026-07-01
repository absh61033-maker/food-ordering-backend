const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Admin login
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: "Invalid admin credentials" });
    }

    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;