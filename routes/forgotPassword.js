const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Forgot Password — email bhejo
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Email not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
   const resetLink = `https://food-ordering-frontend-eta.vercel.app/reset-password/${token}`;

    await sendEmail(
      email,
      "FoodZone — Password Reset Request",
      `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:30px;border-radius:12px;border:1px solid #eee">
        <h2 style="color:#ff6b35">🍔 FoodZone</h2>
       <p>You requested a password reset. Click the button below to set a new password:</p>
        <a href="${resetLink}" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#ff6b35;color:white;border-radius:8px;text-decoration:none;font-weight:bold">Reset Password</a>
       <p style="color:#888;font-size:13px">This link is valid for 15 minutes only. If you didn't request this, please ignore this email.</p>
      </div>`
    );

    res.json({ success: true, message: "Reset link sent to your email!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Reset Password — save new password
router.post("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    res.json({ success: false, message: "Link expired or invalid" });
  }
});

module.exports = router;