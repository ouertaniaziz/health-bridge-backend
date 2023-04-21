const User = require("../model/User");

const getDoctor = async (req, res) => {
  try {
    console.log(req.body);
    const doctor = await User.findById(req.body.userId);
    console.log(doctor);
    if (!doctor) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {}
};
module.exports = {
  getDoctor,
};
