const Appointment = require("../model/Appointment");

// CREATE
const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, time, reason } = req.body;
    const appointment = new Appointment({
      patient,
      doctor,
      date,
      time,
      reason,
    });
    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment created successfully!", appointment });
  } catch (error) {
    res.status(500).json({ error: "Appointment creation failed!" });
  }
};

// READ
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("patient doctor");
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments!" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate(
      "patient doctor"
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found!" });
    }
    res.status(200).json({ appointment });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointment!" });
  }
};

// UPDATE
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient, doctor, date, time, reason } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { patient, doctor, date, time, reason },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found!" });
    }
    res
      .status(200)
      .json({ message: "Appointment updated successfully!", appointment });
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment!" });
  }
};

// DELETE
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found!" });
    }
    res.status(200).json({ message: "Appointment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete appointment!" });
  }
};



module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
