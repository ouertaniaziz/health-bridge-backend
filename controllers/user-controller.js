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
      try {
        const failedAttempt = new Failed({
          userId: user._id,
          time: new Date(),
        });
        await failedAttempt.save();

        const failedAttempts = await Failed.find({ userId: user._id })
          .sort("-time")
          .limit(3);

        if (failedAttempts.length === 3) {
          const banDuration = 60 * 60 * 1000; // 1 hour ban
          const banTime = new Date().getTime() + banDuration;
          user.bannedUntil = new Date(banTime);
          await user.save();
          const canUseAgainAt = new Date(banTime + banDuration);
          return res.status(401).send({
            message:
              "Your account has been temporarily banned due to multiple failed login attempts. Please try again later.",
            bannedUntil: user.bannedUntil,
            canUseAgainAt: canUseAgainAt,
          });
        }
      } catch (error) {
        // Handle error when saving failed attempt
        console.error(error);
      }

      throw new Error("Invalid email or password");
    } else if (
      user.bannedUntil &&
      user.bannedUntil > new Date() &&
      req.get("User-Agent").indexOf("Postman") === -1
    ) {
      // If user is banned and not coming from Postman, update the bannedUntil field
      user.bannedUntil = null;
      await user.save();
      const canUseAgainAt = null;
      return res.status(401).send({
        message: "Your account is temporarily banned. Please try again later.",
        bannedUntil: null,
        canUseAgainAt: canUseAgainAt,
      });
    }

    const unbanUser = (userId) => {
      // Remove the user from the list of banned users
      bannedUsers = bannedUsers.filter((user) => user.userId !== userId);
    };

    const checkForExpiredBans = () => {
      const currentTime = new Date();
      for (let i = 0; i < bannedUsers.length; i++) {
        const { userId, banTime } = bannedUsers[i];
        const timeElapsed = currentTime - banTime;
        const banDuration = 60 * 1000; // 1 minute (adjust as needed)
        if (timeElapsed >= banDuration) {
          unbanUser(userId);
        }
      }
    };

    setInterval(checkForExpiredBans, 60 * 1000);

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
    res.status(200).json({
      accessToken: token,
      username: user.username,
      role: user.role,
      message: "OK",
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
    <p style="font-size:1.1em">Hi,</p>
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
  // Retrieve the JWT token from the request header
  const token = req.headers.authorization.split(" ")[1];

  // Verify and decode the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired authentication token",
      });
    }

    // Perform logout logic here : destroy the user's session to log them out
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error logging out" });
      } else {
        res.status(200).json({ success: "Logged out successfully" });
      }
    });

    // Respond with a success message
    return res.status(200).json({ message: "Successfully logged out" });
  });
};

module.exports = {
  signup,
  login,
  verifyEmail,
  sendRecoveryEmail,
  logout,
};
