const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendverificationMail } = require("../utils/sendemailverification");
const sendEmail = require("../utils/createMail");
const DOMAIN = process.env.DOMAIN;
const nodemailer = require("nodemailer");

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);

const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      firstname: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      address: req.body.address,
      role: req.body.role,
      phone: req.body.phone,
      image: req.body.image,
      speciality: req.body.speciality,
      creationDate: new Date(),
      emailtoken: crypto.randomBytes(64).toString("hex"),
      dateOfBirth: req.body.dateOfBirth,
      bloodGroup: req.body.bloodGroup,
      medicalHistory: req.body.medicalHistory,
      medications: req.body.medications,
      insuranceInformation: req.body.insuranceInformation,
      symptoms: req.body.symptoms,
      testResults: req.body.testResults,
      gender: req.body.sex,
      IdCardDoctor: req.body.IdCardDoctor,
      DateOfGraduation: req.body.DateOfGraduation,
      DateofCreation: req.body.DateofCreation,
      isVerified: false,
      banned: false
    });
    console.log("here!");
    await user.save();
    sendverificationMail(user);

    //sendverificationMail(user);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid password" });
      
    }
    
    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
    res.status(200).json({
      accessToken: token,
      username: user.username,
      message: "OK",
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};


const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.body.emailtoken;
    const user = await User.findOne({ emailtoken: emailToken });
    if (user) {
      console.log("user is found!");
      user.emailtoken = null;
      //user.isVerified = true;
      await user.save();
      res.status(200).send();
    }
  } catch (error) {
    console.log(error);
    res.status(404).json(error.message);
  }
};

//todo template html, token in db

const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const payload = { user_email: user.email };
    const options = { expiresIn: "1h" };
    const resetToken = jwt.sign(payload, process.env.RESET_SECRET, options);
    const URL = process.env.CLIENT_URL;
    const transporter = nodemailer.createTransport();
    const mailoptions = {
      from: `"Health Bridge" <${process.env.Email}`,
      to: user.email,
      subject: "Verify link",
      html: `<p> Hello ${user.username}, please verify
        your email by clicking this link </p>
        <p>${URL}</p>
        `,
    };
    transporter.sendMail(mailoptions, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("verification email sent");
      }
    });

    await User.updateOne({ email }, { resetToken });
    res.json({ message: "Reset password link has been sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending email" });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;
    const decodedToken = jwt.verify(resetToken, process.env.RESET_SECRET);
    const user = await User.findOne({ email: decodedToken.user_email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await User.updateOne(
      { email: user.email },
      { password: passwordHash, resetToken: null }
    );
    res.json({ message: "Password reset successful" });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    console.error(error);
    res.status(500).json({ message: err });
  }
};

const updatePassword = async (req, rew) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      updateStatus: false,
      userFound: false,
    });
  }
  //update pwd
  const update = await User.updateOne(
    { email: user.email },
    { password: bcrypt.hashSync(password, 8) }
  );

  if (!update) {
    return res.status(500).json({
      message: "Failed to update password",
      updateStatus: false,
      userFound: true,
    });
  }
  //delete reset token
  await User.updateOne({ email }, { $unset: { resetpwdToken: 1 } });
  return res.json({
    message: "Password updated successfully",
    updateStatus: true,
    userFound: true,
  });
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Get JWT token from Authorization header
    await jwt.verify(token, process.env.SECRET); // Verify JWT token
    // If JWT is valid, simply send a success response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // If JWT is invalid or missing, send an error response
    res.status(401).json({ message: "Unauthorized" });
  }
};

const client = mailgun.client({ username: 'api', key: '5c207d5bd8e7882951176d1558e4477a-b36d2969-c41d7190' || '' });
(async () => {
  try {
    const validationRes = await client.validate.get('andy.houssem@gmail.com');
    console.log('validationRes', validationRes);
  } catch (error) {
    console.error(error);
  }
})();
module.exports = {
  signup,
  login,
  verifyEmail,
  ForgetPassword,
  ResetPassword,
  updatePassword,
  logout
};
