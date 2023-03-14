const User = require("../model/User");
const Failed = require("../model/Failed");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendverificationMail } = require("../utils/sendemailverification");
const sendEmail = require("../utils/createMail");



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

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // user exists, create a one-time link valid for 15min
    const payload = {
      user_email: user.email,
    };
    const options = {
      expiresIn: "1h",
    };
    const token = jsonwebtoken.sign(
      payload,
      process.env.RESET_SECRET,
      options
    );

    // send email with reset password link
    const link = `http://localhost:3000/api/reset-password/${token}`;
    const mailOption = {
      from: process.env.Email,
      to: req.body.email,
      subject: "Reset Password",
      html: `<p>Hello ${user.firstname} ${user.lastname},</p>
            <p>Please click on the following link to reset your password:</p>
            <p><a href="${link}">${link}</a></p>`,
    };
    await sendEmail(mailOption); // assuming sendEmail is defined and working correctly
    await User.updateOne(
      { email: req.body.email },
      { resetPasswordToken: token, resetPasswordExpires: Date.now() + 900000 }
    );

    console.log(link);
    res.status(200).json({ message: "Email sent", link });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending email" });
  }
};




const verifyLink = async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
    });

    if (!user) {
      return res.json({
        valid: false,
        message: "Invalid reset Token!",
      });
    }

    if (token == user.resetPasswordToken) {
      const decodedToken = jsonwebtoken.verify(token, process.env.RESET_SECRET);
      // Check if the reset token has expired
      const resetTime = new Date(decodedToken.iat * 1000);
      console.log("resetTime", resetTime);
      const expirationTime = new Date(resetTime.getTime() + 60 * 60 * 1000); // 1h expiration
      const currentTime = new Date();
      if (currentTime > expirationTime) {
        //delete reset token
        await User.updateOne({ email }, { $unset: { resetPasswordToken: 1 } });
        return res.json({
          valid: false,
          message: "reset token expired !",
        });
      }
      return res.json({
        valid: true,
        message: "reset token checked !",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res) => {
  const { email, password, resetToken } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        updateStatus: false,
        userFound: false,
      });
    }

    const isTokenValid = await checkResetToken(email, resetToken);
    if (!isTokenValid) {
      return res.status(400).json({
        message: "Invalid reset Token!",
        updateStatus: false,
      });
    }

    // Update password
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

    // Delete reset password token
    await User.updateOne(
      { email },
      { $unset: { resetPasswordToken: 1 } }
    );

    return res.status(200).json({
      message: "Password updated successfully",
      updateStatus: true,
      userFound: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update password",
      updateStatus: false,
      userFound: false,
    });
  }

};


module.exports = {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  verifyLink,
  updatePassword,
};
