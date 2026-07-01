const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.json({ success: false, message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.json({ success: false, message: "Invalid token" });
  }
};

module.exports = authMiddleware;
