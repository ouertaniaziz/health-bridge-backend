const User = require("../model/User");
const Failed = require("../model/Failed");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendverificationMail } = require("../utils/sendemailverification");

const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      address: req.body.address,
      role: req.body.role,
      phone: req.body.phone,
      image: req.body.image,
      speciality: req.body.speciality,
      creationDate: new Date(),
      emailToken: crypto.randomBytes(64).toString("hex"),
      isVerified: false,
    });

    await user.save();

    await sendverificationMail(user);
    console.log("Verification email sent!");
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
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
      // If password is incorrect, add a failed attempt to the collection
      const failedAttempt = new Failed({
        userId: user._id,
        time: new Date(),
      });
      await failedAttempt.save();

      // Check if user has exceeded the limit of failed attempts
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

      throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });

    // Reset the failed attempts count if user logs in successfully
    await Failed.deleteMany({ userId: user._id });

    res.status(200).json({
      accessToken: token,
      username: user.username,
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

module.exports = { signup, login, verifyEmail };
