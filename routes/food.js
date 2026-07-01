const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Food = require("../models/Food");
const adminAuth = require("../middleware/adminAuth");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", adminAuth, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "food-ordering" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }
    const food = new Food({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: imageUrl,
    });
    await food.save();
    res.json({ success: true, message: "Food added!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

router.get("/list", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json({ success: true, data: foods });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

router.post("/remove", adminAuth, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;