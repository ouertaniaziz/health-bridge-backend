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

const sendResetPassword = (email,cnt)=>{
    const mailOptions = {
        from: `"Health Bridge" <${process.env.Email}`,
        to: email,
        subject: "Password Reset",
        html: `<h1>Password reset link</h1>
        <h2>Hello</h2>
        <p>Click on this <a href="http://localhost:3001/resetpassword/${token}"> link </a>to reset your password</p>
        ${cnt}`,
      };
      return transporter.sendMail(mailOptions);
  }

module.exports = { createmailtransportr, sendResetPassword };
