const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const sendEmail = require("../utils/sendEmail");

// Place order
router.post("/place", authMiddleware, async (req, res) => {
  try {
    const order = new Order({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: "COD",
      paymentStatus: "Pending",
    });
    await order.save();
    await User.findByIdAndUpdate(req.userId, { cartData: {} });
    res.json({ success: true, message: "Order placed!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Get user orders
router.post("/userorders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Get all orders (Admin)
router.get("/list", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ success: true, data: orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Update order status (Admin)
router.post("/status", adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.body.orderId, { status: req.body.status }, { new: true });
    
    const user = await User.findById(order.userId);
    console.log("User found:", user?.email);
    
    if (user && user.email) {
      try {
        const statusMessages = {
          "Food Processing": "Your order is being processed! 🍳",
          "Out for Delivery": "Your order is on the way! 🚗",
          "Delivered": "Your order has been delivered! Enjoy 😋"
        };
        await sendEmail(
          user.email,
          `FoodZone — Order Update: ${req.body.status}`,
          `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:30px;border-radius:12px;border:1px solid #eee">
            <h2 style="color:#ff6b35">🍔 FoodZone Order Update</h2>
            <p>${statusMessages[req.body.status] || "Your order status has been updated."}</p>
            <div style="background:#fff4e0;padding:16px;border-radius:8px;margin:16px 0">
              <b>Status:</b> ${req.body.status}
            </div>
            <p style="color:#888;font-size:13px;margin-top:20px">FoodZone Team</p>
          </div>`
        );
        console.log("Email sent to:", user.email);
      } catch (emailErr) {
        console.log("Email error:", emailErr.message);
      }
    }
    
    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;