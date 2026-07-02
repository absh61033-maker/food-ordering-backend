const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all required fields" });
  }

  try {
    // Admin ko notification email
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `New Contact Message: ${subject || "General Inquiry"}`,
      `
        <h2>New message from FoodZone contact form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    );

    // User ko confirmation email
    await sendEmail(
      email,
      "We received your message - FoodZone",
      `
        <h2>Thanks for reaching out! 🍔</h2>
        <p>Hi ${name}, we've received your message and our team will get back to you within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <br/>
        <p>— Team FoodZone</p>
      `
    );

    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.log("Contact form error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message. Please try again later." });
  }
});

module.exports = router;