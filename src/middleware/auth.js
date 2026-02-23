const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = (req, res, next) => {
  
  
  try {
    const token = req.cookies.token;

    
    if (!token) {
      return res.status(401).send("Access denied. No token provided");
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

  req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
};
