const AdminPolyclinic = require("../model/AdminPolyclinic");
const Doctor = require("../model/Doctor");
const Patient = require("../model/Patient");
const Prescription = require("../model/Prescription");

const removePatientFromPolyclinic = async (req, res) => {
    try {
      const polyclinic = await AdminPolyclinic.findByIdAndUpdate(
        req.params.id,
        { $pull: { patients: req.params.patientId } }
      );

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
      const polyclinic = await AdminPolyclinic.findByIdAndUpdate(
        req.params.id,
        { $pull: { doctors: req.params.doctorId } }
      );

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
      const polyclinic = await AdminPolyclinic.findById(req.params.id).populate(
        {
          path: "prescriptions",
          match: { _id: req.params.prescriptionId },
          populate: {
            path: "doctor",
            select: "name -_id",
          },
        }
      );

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
    res
      .status(500)
      .json({
        error: `Error getting polyclinic dashboard stats: ${error.message}`,
      });
  }
};

module.exports = {
    removePatientFromPolyclinic,
    removeDoctorFromPolyclinic,
    getPolyclinicByLocation,
    getAllPolyclinics,
    getPrescriptionsForPolyclinic,
    getPolyclinicDashboardStats,
};