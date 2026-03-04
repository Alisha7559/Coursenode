const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Your token contains { id }
    req.user = {
      id: decoded.id
    };

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};