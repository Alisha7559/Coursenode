const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log(req.cookies.token);
  
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("Access denied. No token provided");
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded.id; 
    req.role = decoded.role;

    next();
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
};
