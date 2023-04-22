const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authenticateUser = async (req, res, next) => {
  try {
    // Check if the Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // Get the token from the Authorization header
    const token = authHeader.replace("Bearer ", "");

    // Verify the token and get the user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach the user object to the request for future use
    req.user = user;

    // Call the next middleware function
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = authenticateUser;