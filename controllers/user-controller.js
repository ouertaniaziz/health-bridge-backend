const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendverificationMail } = require("../utils/sendemailverification");
const sendEmail = require("../utils/createMail");
const DOMAIN = process.env.DOMAIN;
const nodemailer = require("nodemailer");
const { sendResetPassword } = require("../utils/createMail");
const AdminPolyclinc = require("../model/AdminPolyclinic");
const fs = require("fs");
const multer = require("multer");
const Record = require("../model/Record");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);

const signup = async (req, res) => {
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
      image: eq.file &&
        req.buffer && {
          data: fs.readFileSync(req.file.path),
          contentType: req.file.mimetype,
        },
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
    } else if (req.body.role === "adminpolyclinic") {
      console.log("adminpolyclinic triggered");

      const adminpolyclinic = new AdminPolyclinc({
        user: user._id,
        polyname: req.body.polyname,
        password: hashedPassword,
        location: req.body.location,
        medicalRecords: req.body.medicalRecords,
        prescription: req.body.prescription,
      });

      await user.save();
      await adminpolyclinic.save();
    }

    sendverificationMail(user);

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

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
    res.status(200).json({
      accessToken: token,
      username: user.username,
      role: user.role,
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
//signup new
const signupwithimage = async (req, res) => {
  try {
    console.log(req.body);
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/"); // replace with your upload directory
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
         console.log(file.originalname);
      },
    });
    const upload = multer({ storage });
    upload.single("file")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(500).send(err.message);
      } else if (err) {
        // An unknown error occurred when uploading
        console.log(err);
        return res.status(500).send(err.message);
      }
      const imagePath = req.file.path;

      // Read the image file as a binary buffer
      const imageBuffer = fs.readFileSync(imagePath);

      // Convert the binary buffer to a base64-encoded string
      const base64Image = Buffer.from(imageBuffer).toString("base64");
      const userimg = JSON.parse(req.body.user);
      console.log(userimg);
      console.log()
      const hashedPassword = await bcrypt.hash(userimg.password, 10);
     
      const user = new User({
        username: userimg.username,
        firstname: userimg.name,
        lastname: userimg.LastName,
        email: userimg.email,
        password: hashedPassword,
        address: userimg.address,
        role: userimg.role,
        phone: userimg.phone,
        image: base64Image,
        speciality: userimg.speciality,
        creationDate: new Date(),
        emailtoken: crypto.randomBytes(64).toString("hex"),
        // dateOfBirth: userimg.dateOfBirth,
        //bloodGroup: req.body.bloodGroup,
        //medicalHistory: req.body.medicalHistory,
        //medications: req.body.medications,
        //insuranceInformation: req.body.insuranceInformation,
        //symptoms: req.body.symptoms,
        //testResults: req.body.testResults,
        // gender: userimg.sex,
        // IdCardDoctor: userimg.IdCardDoctor,
        // DateOfGraduation: userimg.DateOfGraduation,
        // DateofCreation: userimg.DateofCreation,
        // isVerified: false,
        // banned: false,
        // city: userimg.city,
        // postal_code: userimg.postal_code,
        // state: userimg.state,
      });
              await user.save();

      console.log("here!");
      if (userimg.role === "doctor") {
        const doctor = new Doctor({
          user: user._id,
          name: req.body.name,
          password: hashedPassword,
          speciality: req.body.speciality,
          aboutMe: req.body.aboutMe,
        });
        await user.save();

        await doctor.save();
      } else if (userimg.role === "patient") {
        console.log("patien triggered");
        const us = await user.save();

        const patient = new Patient({
          user: us._id,
          bloodGroup: req.body.bloodGroup,
          insuranceInformation: req.body.insuranceInformation,
        });
        await patient.save();
      } else if (userimg.role === "pharmacist") {
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
      } else if (userimg.role === "adminpolyclinic") {
        console.log("adminpolyclinic triggered");

        const adminpolyclinic = new AdminPolyclinc({
          user: user._id,
          polyname: req.body.polyname,
          password: hashedPassword,
          location: req.body.location,
          medicalRecords: req.body.medicalRecords,
          prescription: req.body.prescription,
        });

        await user.save();
        await adminpolyclinic.save();
      } 

      // sendverificationMail(user);

      res.status(201).json({ message: "User created successfully", userimg });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  verifyEmail,
  ResetPassword,
  UpdatePassword,
  logout,
  signupwithimage,
};
