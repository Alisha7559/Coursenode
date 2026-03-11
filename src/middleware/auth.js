const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {

  try {

    let token = req.cookies.token;

    if(!token && req.headers.authorization){
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }

};