const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: {
      type: String,
      default: "Food Processing",
      enum: ["Food Processing", "Out for Delivery", "Delivered"],
    },
   paymentMethod: { type: String, default: "COD", enum: ["COD"] },
    paymentStatus: { type: String, default: "Pending", enum: ["Pending", "Paid"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
