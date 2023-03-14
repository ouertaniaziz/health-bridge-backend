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
/*
const checkRolesExisted = (req, res, next) => {
  const roles = req.body.role;
  const validRoles = Object.values(User.Role);

  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      if (!validRoles.includes(roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${roles[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};*/
const verifysignup = {
  checkDuplicateUsernameOrEmail,
  /*checkRolesExisted,*/
};

module.exports = verifysignup;
