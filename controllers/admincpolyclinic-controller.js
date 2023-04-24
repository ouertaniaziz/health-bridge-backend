const Prescription = require("../models/prescription");
const User = require("../model/User");
const AdminPolyclinic = require("../model/AdminPolyclinic");

const getPrescriptionsForPolyclinic = async (req, res) => {
  const polyclinicId = req.params.polyclinicId;

  try {
    // Check if the polyclinic exists
    const polyclinic = await AdminPolyclinic.findById(polyclinicId);
    if (!polyclinic) {
      return res.status(404).json({ message: "Polyclinic not found" });
    }

    // Get all prescriptions assigned to this polyclinic
    const prescriptions = await Prescription.find({ polyclinic: polyclinicId })
      .populate("patient", "username firstname lastname")
      .populate("doctor", "username firstname lastname")
      .exec();

    // Return the prescriptions
    res.json({ prescriptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { tPrescriptionsForPolyclinic };