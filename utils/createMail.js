const nodemailer = require("nodemailer");
const createmailtransportr = () => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: `${process.env.Email}`,
      pass: `${process.env.password}`
    },
  });
  return transporter;
};
module.exports = { createmailtransportr };
