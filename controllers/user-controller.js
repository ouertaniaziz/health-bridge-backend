const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendverificationMail } = require("../utils/sendemailverification");
const sendEmail = require("../utils/createMail");
const DOMAIN = process.env.DOMAIN;
const nodemailer = require("nodemailer");
const { forgotpwd } = require("../utils/forgetpwd");

const formData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);

const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      firstname: req.body.name,
      lastname: req.body.LasNname,
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
      banned: false,
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
      // Increment failed login attempts and check for ban
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 3) {
        const banTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour ban
        user.bannedUntil = new Date(banTime);
        await user.save();
        user.failedLoginAttempts = 0; // Reset failed login attempts
        return res.status(401).json({
          message:
            "Your account has been temporarily banned due to multiple failed login attempts. Please try again later.",
          bannedUntil: user.bannedUntil,
        });
      }
      await user.save();

      return res.status(401).json({ message: "Invalid password" });
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
    res.status(200).json({
      accessToken: token,
      username: user.username,
      message: "OK",
      expiresIn: process.env.JWT_EXPIRE_IN,
      role: user.role,
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
    if (!email)
      return res.status(400).json({ error: "Please enter your email" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "No email could not be send" });

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = forgotpwd(resetUrl, user);

    const result = sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    if (await result)
      return res.status(200).json({
        message: `An email has been sent to ${email} with further instructions.`,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { password, resetToken } = req.body;

    if (!resetToken || !password)
      return res.status(400).json({ error: "Invalid Request" });

    const resetpwdToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetpwdToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid Token or expired" });

    user.password = password;
    user.resetpwdToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

const client = mailgun.client({
  username: "api",
  key: "5c207d5bd8e7882951176d1558e4477a-b36d2969-c41d7190" || "",
});
(async () => {
  try {
    const validationRes = await client.validate.get("andy.houssem@gmail.com");
    console.log("validationRes", validationRes);
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
  logout,
};
