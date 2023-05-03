const Appointment = require("../model/Appointment");
const express = require("express");
const Patient = require("../model/Patient");
const Doctor = require("../model/Doctor");
const User = require("../model/User");
const moment = require("moment");

// CREATE
const createAppointment = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.body.doctorId);
    const patient = await Patient.findOne({ user: req.body.patientId });

    const { date, time, reason } = req.body;
    const appointment = new Appointment({
      patient,
      doctor,
      date,
      time,
      reason,
    });
    console.log(appointment);
    await appointment.save();
    global.io.emit("notification", { idd: doctor._id });

    res
      .status(201)
      .json({ message: "Appointment created successfully!", appointment });
  } catch (error) {
    res.status(500).json({ error: "Appointment creation failed!" });
  }
};
const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await Doctor.find({ user: doctorId });
    const appointments = await Appointment.find({ doctor: doctor });

    const customizedAppointments = [];
    for (const appointment of appointments) {
      const patient = await Patient.findById(appointment.patient)
        .populate("user")
        .exec();
      const time = appointment.time;
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setMinutes(date.getMinutes() + 30);
      const startTimeString = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      date.setMinutes(date.getMinutes() + 30);
      const endTimeString = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dateTimeString = `${startTimeString} - ${endTimeString}`;

      const customizedAppointment = {
        patientId: patient._id,
        img: "/content/user-40-1.jpg",
        id: appointment._id,
        name: patient.user.username,
        email: patient.user.email,
        number: patient.user.phone,
        date: appointment.date.toDateString(),
        fromTo: dateTimeString,
        injury: appointment.reason,
      };
      customizedAppointments.push(customizedAppointment);
    }

    res.status(200).json(customizedAppointments);
  } catch (error) {
    res.status(500).json({ error: "Error getting appointments!" });
  }
};
const getAvailableSlots = async (req, res) => {
  const doctorId = req.params.doctorId;

  const startDate = moment().add(1, "day").startOf("day");
  const endDate = moment().startOf("isoWeek").add(3, "week").add(1, "day");
  try {
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startDate, $lte: endDate },
      status: "Scheduled",
    }).select("date time");

    const reservedTimes = existingAppointments.map((appointment) => ({
      date: moment(appointment.date).format("YYYY-MM-DD"),
      time: appointment.time,
    }));

    const availableSlots = [];
    let currentDate = startDate.clone();
    const availableTimes = [
      "10h",
      "10:30",
      "11h",
      "11:30",
      "12h",
      "14h",
      "14:30",
      "15h",
      "15:30",
      "16h",
      "16:30",
    ];
    while (currentDate.isSameOrBefore(endDate)) {
      availableTimes.forEach((time) => {
        const reservedTime = reservedTimes.find(
          (rt) =>
            rt.date === currentDate.format("YYYY-MM-DD") && rt.time === time
        ); // Modification 3
        if (!reservedTime) {
          availableSlots.push({
            date: currentDate.format("YYYY-MM-DD"),
            time,
          });
        }
      });
      currentDate.add(1, "day");
    }

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: "Failed to return" });
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
  getAppointmentsByDoctorId,
  getAvailableSlots,
};
