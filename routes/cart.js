const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// Add to cart
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const cartData = user.cartData || {};
    cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;
    await User.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Remove from cart
router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const cartData = user.cartData || {};
    if (cartData[req.body.itemId] > 0) cartData[req.body.itemId] -= 1;
    await User.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Removed from cart" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Get cart
router.post("/get", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ success: true, cartData: user.cartData });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
