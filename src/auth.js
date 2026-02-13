
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // 1️⃣ get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 2️⃣ verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    // 3️⃣ attach user to request
    req.user = decoded; // { id, role }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
