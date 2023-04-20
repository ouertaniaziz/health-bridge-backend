const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Get JWT token from Authorization header
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    req.userData = { userId: decodedToken.userId }; // Save user ID in request object
    next(); // Move on to next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" }); // If JWT is invalid or missing, send an error response
  }
};

module.exports = authMiddleware;
