const User = require("../model/User");
const Failed = require("../model/Failed");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendverificationMail } = require("../utils/sendemailverification");
const sendEmail = require("../utils/createMail");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");



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
    });
    //console.log("user saved!");
    await user.save();
    sendverificationMail(user);
    console.log("mail sent!");
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    if (!emailToken) return res.status(404).json("emailtoken not found");
    const user = await User.findOne({ emailtoken: emailToken });
    if (user) {
      user.emailtoken = null;
      user.isVerified = true;
      await user.save();
      res.status(200).json({
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      });
    } else res.status(404).json("email verif failed,invalid token");
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

//todo template html, token in db

const ForgetPassword = async (req, res) => {
   const { email } = req.body.email;
   const URL = process.env.CLIENT_URL;

   try {
     const user = await User.findOne({ email });
     if (!user) {
       res.status(404).json({ message: "Error : user doesn't exist" });
     } else {
       res.status(200).json({ message: "Welcome" });
       sgMail.setApiKey(process.env.SENDGRID_API_KEY);
       const msg = {
         to: email,
         from: `${process.env.Email}`,
         subject: "Welcome to Kaddem Project",
         html: `
				<h2>Click the link to reset your password</h2>
				<p>${URL}</p>
			`,
         //templateId: 'd-e09cf57a0a0e45e894027ffd5b6caebb',
       };
       sgMail
         .send(msg)
         .then(() => {
           console.log("Email sent");
         })
         .catch((error) => {
           console.error(error);
         });
     }
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
}

const ResetPassword = async (req, res) => {
  const { email, password, newpassword } = req.body;

        try {
            const user = await User.findOne({ email });
            const user2 = await User.resetpwd(password, newpassword)
            if (user2) {
                res.status(400).json({ error: "passwords don't match" });
            }
            if (!user) {
                res.status(400).json({ error: "User don't exists" });
            } else{
                user.password = await bcrypt.hash(req.body.password, 10);
                await user.save();
        
                res.status(200).json({ message: "password changed" });
            }
    
        } catch (error) {
            res.status(400).json({error: error.message})
        }
}

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

module.exports = {
  signup,
  login,
  verifyEmail,
  ForgetPassword,
  ResetPassword,
  logout,
};
