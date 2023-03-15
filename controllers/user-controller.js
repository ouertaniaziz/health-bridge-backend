const User = require("../model/User");
const Failed = require("../model/Failed");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendverificationMail } = require("../utils/sendemailverification");
const sendEmail = require("../utils/createMail");
const nodemailer = require("nodemailer");

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

// const login = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });

//     // Check if user exists
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // // Check if user is banned
//     // if (user.banned && user.banLiftsAt > Date.now()) {
//     //   return res
//     //     .status(403)
//     //     .json({ message: `User is banned until ${user.banLiftsAt}` });
//     // }

//     // Verify password
//     const passwordIsValid = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );

//     if (!passwordIsValid) {
//       // Increment failed login attempts
//       user.failedLoginAttempts++;
//       console.log(user.failedLoginAttempts);
//       if (user.failedLoginAttempts >= 3) {
//         // User has exceeded the threshold, ban them for 1 hour
//         user.banned = true;
//         user.banLiftsAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
//         await user.save();
//         return res
//           .status(403)
//           .json({ message: `User is banned until ${user.banLiftsAt}` });
//       }
//       await user.save();
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Reset failed login attempts
//     user.failedLoginAttempts = 0;
//     await user.save();

//     // Generate access token
//     const accessToken = jwt.sign({ sub: user.id }, process.env.SECRET);

//     return res.status(200).json({ accessToken });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error });
//   }
// };





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

function sendRecoveryEmail({ email, OTP }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: `${process.env.Email}`,
        pass: `${process.env.password}`,
      },
    });

    const mail_configs = {
      from: `"Health Bridge" <${process.env.Email}>`,
      to: email,
      subject: "PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
            <html lang="en" >
            <head>
                      <meta charset="UTF-8">
                      <title>HealthBridge - OTP Email Template</title>
  

            </head>
            <body>
              <!-- partial:index.partial.html -->
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">HealthBridge Admin</a>
                </div>
                    <p style="font-size:1.1em">Hi <${User.username}></p>
                    <p>Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                    <p style="font-size:0.9em;">Regards,<br />HealthBridge </p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                      <p>HealthBridge Inc</p>
                      <p>1600 Amphitheatre Parkway</p>
                      <p>Tunisia</p>
                    </div>
                  </div>
                </div>
              <!-- partial -->
                  
              </body>
              </html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
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
  sendRecoveryEmail,
  logout
};
