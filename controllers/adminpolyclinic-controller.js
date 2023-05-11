const AdminPolyclinic = require("../model/AdminPolyclinic");
const Doctor = require("../model/Doctor");
const Patient = require("../model/Patient");
const Prescription = require("../model/Prescription");

const removePatientFromPolyclinic = async (req, res) => {
  try {
    const polyclinic = await AdminPolyclinic.findByIdAndUpdate(req.params.id, {
      $pull: { patients: req.params.patientId },
    });

    if (!polyclinic) {
      return res.status(404).send({ error: "Polyclinic not found" });
    }

    res.send(polyclinic);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const removeDoctorFromPolyclinic = async (req, res) => {
  try {
    const polyclinic = await AdminPolyclinic.findByIdAndUpdate(req.params.id, {
      $pull: { doctors: req.params.doctorId },
    });

    if (!polyclinic) {
      return res.status(404).send({ error: "Polyclinic not found" });
    }

    res.send(polyclinic);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const getPolyclinicByLocation = async (req, res) => {
  try {
    const polyclinic = await AdminPolyclinic.findOne({
      location: req.params.location,
    });

    if (!polyclinic) {
      return res.status(404).send({ error: "Polyclinic not found" });
    }

    res.send(polyclinic);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const getAllPolyclinics = async (req, res) => {
  try {
    const polyclinics = await AdminPolyclinic.find();

    res.send(polyclinics);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

const getPrescriptionsForPolyclinic = async (req, res) => {
  try {
    const polyclinic = await AdminPolyclinic.findById(req.params.id).populate({
      path: "prescriptions",
      match: { _id: req.params.prescriptionId },
      populate: {
        path: "doctor",
        select: "name -_id",
      },
    });

    if (!polyclinic) {
      return res.status(404).send({ error: "Polyclinic not found" });
    }

    const prescription = polyclinic.prescriptions.find(
      (p) => p.id === req.params.prescriptionId
    );

    if (!prescription) {
      return res.status(404).send({ error: "Prescription not found" });
    }

    res.send({
      doctorName: prescription.doctor.name,
      patientName: prescription.patientName,
      medication: prescription.medication,
      dosage: prescription.dosage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

const getPolyclinicDashboardStats = async (req, res) => {
  try {
    const polyclinic = await AdminPolyclinic.findById(req.params.id);

    if (!polyclinic) {
      throw new Error("Polyclinic not found");
    }

    const doctorCount = await Doctor.countDocuments({
      polyclinic: req.params.id,
    });
    const patientCount = await Patient.countDocuments({
      polyclinic: req.params.id,
    });
    const totalPrescriptionCount = await Prescription.countDocuments({
      polyclinic: req.params.id,
    });
    const verifiedPrescriptionCount = await Prescription.countDocuments({
      polyclinic: req.params.id,
      verified: true,
    });

    res.json({
      doctorCount,
      patientCount,
      totalPrescriptionCount,
      verifiedPrescriptionCount,
    });
  } catch (error) {
    res.status(500).json({
      error: `Error getting polyclinic dashboard stats: ${error.message}`,
    });
  }
};
const getAllPrescriptionsPolyclinic = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      Polyclinicstatus: "Pending",
    })
      .populate({
        path: "patient",
        select: "_id cin",
        populate: {
          path: "user",
          select: "firstname lastname _id",
        },
      })
      .populate({
        path: "doctor",
        select: "_id",
        populate: {
          path: "user",
          select: "firstname lastname _id",
        },
      })
      .populate("traitement", "medicationName")
      .exec();

    const modifiedPrescriptions = prescriptions.map((prescription) => ({
      _id: prescription._id,
      patient: {
        _id: prescription.patient._id,
        username: prescription.patient.user.username,
        cin: prescription.patient.cin,
        firstname: prescription.patient.user.firstname,
        lastname: prescription.patient.user.lastname,
      },
      doctor: {
        _id: prescription.doctor._id,
        firstname: prescription.doctor.user.firstname,
        lastname: prescription.doctor.user.lastname,
      },
      traitement: prescription.traitement.map((treatment) => ({
        _id: treatment._id,
        medicationName: treatment.medicationName,
      })),
      date: prescription.date,
    }));

    res.status(200).json(modifiedPrescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const approvePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.body._id);
    console.log(prescription);
    if (
      prescription.Polyclinicstatus === "Approved" ||
      prescription.Polyclinicstatus == "Declined"
    ) {
      return res
        .status(400)
        .json({ status: "failed", message: "already approved" });
    } else {
      const updated = await Prescription.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            Polyclinicstatus: "Approved",
          },
        },

        {
          new: true,
        }
      );

      res.status(200).json(updated);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const declinePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.body._id);
    console.log(prescription);
    if (
      prescription.Polyclinicstatus === "Declined" ||
      prescription.Polyclinicstatus === "Approved"
    ) {
      return res
        .status(400)
        .json({ status: "failed", message: "already declined" });
    } else {
      const updated = await Prescription.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            Polyclinicstatus: "Declined",
          },
        },

        {
          new: true,
        }
      );

      res.status(200).json(updated);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotalDeclinedPrescriptions = async (req, res) => {
  try {
    const count = await Prescription.countDocuments({
      Polyclinicstatus: "Declined",
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getTotalApprovedPrescriptions = async (req, res) => {
  try {
    const count = await Prescription.countDocuments({
      Polyclinicstatus: "Approved",
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getTotalPatients = async (req, res) => {
  try {
    const count = await Patient.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotalDoctors = async (req, res) => {
  try {
    const count = await Doctor.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  removePatientFromPolyclinic,
  removeDoctorFromPolyclinic,
  getPolyclinicByLocation,
  getAllPolyclinics,
  getPrescriptionsForPolyclinic,
  getPolyclinicDashboardStats,
  getAllPrescriptionsPolyclinic,
  approvePrescription,
  declinePrescription,
  getTotalDeclinedPrescriptions,
  getTotalApprovedPrescriptions,
  getTotalPatients,
  getTotalDoctors,
};
