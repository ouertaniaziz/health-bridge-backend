const User = require("../model/User");

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Check username
  console.log("Checking username");
  User.findOne({
    username: req.body.username,
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Username is already taken",
      });
      return;
    }

    // Check email
    User.findOne({
      email: req.body.email,
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Email is already taken",
        });
        return;
      }

      next();
    });
  });
};

const verifysignup = {
  checkDuplicateUsernameOrEmail
};

module.exports = verifysignup;
