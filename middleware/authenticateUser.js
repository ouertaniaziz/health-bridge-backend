// const jwt = require("jsonwebtoken");
// const User = require("../model/User");

// const authenticateUser = async (req, res, next) => {
//   try {

//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).json({ error: "Authorization header missing" });
//     }

    
//     const token = authHeader.replace("Bearer ", "");


//     const decoded = jwt.verify(token, process.env.SECRET);
//     const userId = decoded._id;

    
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(401).json({ error: "User not found" });
//     }
//     req.user = user;

//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ error: "Authentication failed" });
//   }
// };

// module.exports = authenticateUser;