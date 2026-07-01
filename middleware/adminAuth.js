const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ success: false, message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ success: false, message: "Admin access only" });
    }
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = adminAuthMiddleware;