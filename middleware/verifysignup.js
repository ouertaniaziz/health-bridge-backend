const User = require("../model/User");
const Donor = require("../model/Donor")


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

const checkDuplicateNameOrEmail = (req, res, next) => {
  // Check username
  console.log("Checking name");
  Donor.findOne({
    name: req.body.name,
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: " name is already taken",
      });
      return;
    }

    // Check email
    Donor.findOne({
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
  checkDuplicateUsernameOrEmail,
  checkDuplicateNameOrEmail
};

module.exports = verifysignup;
