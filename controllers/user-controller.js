const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendverificationMail } = require("../utils/sendemailverification");
const sendEmail = require("../utils/createMail");
const DOMAIN = process.env.DOMAIN;
const nodemailer = require("nodemailer");
const { sendResetPassword } = require("../utils/createMail");
const Doctor = require("../model/Doctor");

const formData = require("form-data");
const Mailgun = require("mailgun.js");
const Patient = require("../model/Patient");
const Pharmacist = require("../model/Pharmacist");

const mailgun = new Mailgun(formData);

const signup = async (req, res) => {
  console.log(req.body.role);

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(req.body);
    const user = new User({
      username: req.body.username,
      firstname: req.body.name,
      lastname: req.body.LastName,
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
      //bloodGroup: req.body.bloodGroup,
      //medicalHistory: req.body.medicalHistory,
      //medications: req.body.medications,
      //insuranceInformation: req.body.insuranceInformation,
      //symptoms: req.body.symptoms,
      //testResults: req.body.testResults,
      gender: req.body.sex,
      IdCardDoctor: req.body.IdCardDoctor,
      DateOfGraduation: req.body.DateOfGraduation,
      DateofCreation: req.body.DateofCreation,
      isVerified: false,
      banned: false,
      city: req.body.city,
      postal_code: req.body.postal_code,
      state: req.body.state,
    });
    console.log("here!");
    if (req.body.role === "doctor") {
      const doctor = new Doctor({
        user: user._id,
        name: req.body.name,
        password: hashedPassword,
        speciality: req.body.speciality,
        aboutMe: req.body.aboutMe,
      });
      await user.save();

      await doctor.save();
    } else if (req.body.role === "patient") {
      console.log("patien triggered");
      const us = await user.save();

      const patient = new Patient({
        user: us._id,
        bloodGroup: req.body.bloodGroup,
        insuranceInformation: req.body.insuranceInformation,
      });
      await patient.save();
    } else if (req.body.role === "pharmacist") {
      console.log("pharmacist triggered");

      const pharmacist = new Pharmacist({
        user: user._id,
        name: req.body.name,
        password: hashedPassword,
        pharmacieName: req.body.pharmacieName,
        insuranceInformation: req.body.insuranceInformation,
      });

      await user.save();
      await pharmacist.save();
    } else {
      await user.save();
    }

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
    console.log(user);
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
    //for patientsonly
    const patient = await Patient.findOne({ user: user._id });
    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
    if (patient) {
      res.status(200).json({
        accessToken: token,
        username: user.username,
        role: user.role,
        message: "OK",
        expiresIn: process.env.JWT_EXPIRE_IN,
        role: user.role,
        id: user._id,
        cinverified: patient.cinverified,
      });
      
    }
    else{
    res.status(200).json({
      accessToken: token,
      username: user.username,
      role: user.role,
      message: "OK",
      expiresIn: process.env.JWT_EXPIRE_IN,
      role: user.role,
      id: user._id,
      // cinverified: patient.cinverified,
    });
  }
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

const ResetPassword = async (req, res) => {
  try {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        throw new Error("Failed to reset password");
      }
      const token = buffer.toString("hex");
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return res
            .status(422)
            .json({ error: "User doesn't exist with that email" });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user.save().then((result) => {
          sendResetPassword(user);
          res.json({ message: "Check your email" });
        });
      });
    });
  } catch (err) {
    console.log(err.message); // log the error message
    throw new Error("Failed to reset password");
  }
};

const UpdatePassword = async (req, res) => {
  // replace _id with email
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); // replace _id with email
    if (!user) {
      throw new Error("User not found");
    }
    console.log(email); // replace _id with email
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    user.password = hashedPassword;
    const updatedUser = await user.save();
    return updatedUser;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update password");
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Get JWT token from Authorization header
    await jwt.verify(token, process.env.SECRET); // Verify JWT token

    // If JWT is valid, send a success response
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    // If JWT is invalid or missing, send an error response
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// const client = mailgun.client({
//   username: "api",
//   key: "5c207d5bd8e7882951176d1558e4477a-b36d2969-c41d7190" || "",
// });
// (async () => {
//   try {
//     const validationRes = await client.validate.get("andy.houssem@gmail.com");
//     console.log("validationRes", validationRes);
//   } catch (error) {
//     console.error(error);
//   }
// })();

module.exports = {
  signup,
  login,
  verifyEmail,
  ResetPassword,
  UpdatePassword,
  logout,
};
