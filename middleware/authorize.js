// const jwt = require("jsonwebtoken");

// const authorize = (req, res, next) => {
//   const headers = req.headers;
//   if (!headers || !headers.authorization) {
//      return res.status(403).send({
//        message: "No token provided!",
//      });
//   }

//   try {
//     const decoded = jwt.verify(headers.authorization, process.env.SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     return res.status(403).send({ message: "Token is not valid" });
//   }
// };

// module.exports = authorize;
