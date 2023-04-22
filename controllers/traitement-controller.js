const Medication = require("../model/Traitement");

const createMedication = async (req, res) => {
  try {
    const medication = new Medication({
      medicationName: req.body.medicationName,
      manufacturer: req.body.manufacturer,
      dosageForm: req.body.dosageForm,
      dosageStrength: req.body.dosageStrength,
      validationPeriod: req.body.validationPeriod,
      expirationDate: req.body.expirationDate,
      prescriptionRequired: req.body.prescriptionRequired,
      numPackets: req.body.numPackets,
      description: req.body.description,
    });

    const savedMedication = await medication.save();

    res.status(201).json(savedMedication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find();
    res.status(200).json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    res.status(200).json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    medication.medicationName = req.body.medicationName;
    medication.manufacturer = req.body.manufacturer;
    medication.dosageForm = req.body.dosageForm;
    medication.dosageStrength = req.body.dosageStrength;
    medication.validationPeriod = req.body.validationPeriod;
    medication.expirationDate = req.body.expirationDate;
    medication.prescriptionRequired = req.body.prescriptionRequired;
    medication.numPackets = req.body.numPackets;
    medication.description = req.body.description;

    const savedMedication = await medication.save();

    res.status(200).json(savedMedication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    res.status(200).json({ message: "Medication deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMedication,
  getAllMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
};
