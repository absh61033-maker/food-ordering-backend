const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.json({ success: false, message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    try {
      await sendEmail(
        email,
        "Welcome to FoodZone! 🍔",
        `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:30px;border-radius:12px;border:1px solid #eee">
          <h2 style="color:#ff6b35">🍔 Welcome to FoodZone, ${name}!</h2>
          <p>Your account has been created successfully. Now you can order your favourite food!</p>
          <a href="https://food-ordering-frontend-eta.vercel.app" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#ff6b35;color:white;border-radius:8px;text-decoration:none;font-weight:bold">Order Now 🍕</a>
          <p style="color:#888;font-size:13px">FoodZone Team</p>
        </div>`
      );
      console.log("Welcome email sent to:", email);
      // Admin ko email bhejo naye user ka
try {
  await sendEmail(
    process.env.EMAIL_USER,
    "New User Registered on FoodZone! 👤",
    `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:30px;border-radius:12px;border:1px solid #eee">
      <h2 style="color:#ff6b35">👤 New User Registered!</h2>
      <div style="background:#fff4e0;padding:16px;border-radius:8px;margin:16px 0">
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Time:</b> ${new Date().toLocaleString('en-IN')}</p>
      </div>
      <p style="color:#888;font-size:13px">FoodZone Admin Panel</p>
    </div>`
  );
  console.log("Admin email sent!");
} catch (adminEmailErr) {
  console.log("Admin email error:", adminEmailErr.message);
}
    } catch (emailErr) {
      console.log("Welcome email error:", emailErr.message);
    }

    res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;