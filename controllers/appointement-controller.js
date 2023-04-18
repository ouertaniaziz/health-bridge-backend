const Appointement = require("../model/Appointement");


const get_appointment = async (req, res) => {
  const IdUser = req.params.id;
  try {
    const appointments = await Appointement.find({ User: IdUser });
    res.status(200).send({ msg: "appointments", appointments });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const appointment_create_post = async (req, res) => {
  const User = req.params.id;
  const { Firstname, Lastname, Email, Phone, StartDate, EndDate } = req.body;

  try {
    const appointment = await Appointement.create({
      Firstname,
      Lastname,
      Phone,
      StartDate,
      EndDate,
      User,
    });
    res.status(201).json({ appointment: appointment });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
const appointment_delete = (req, res) => {
  const id = req.params.id;

  Appointement.findByIdAndDelete(id)
    .then(() => {
      res.status(200).send({ msg: "appointment deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

const UpdateAppointement = async (req, res) => {
  try {
    const A = await Appointement.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );
    if (A.nModified) {
      return res.send({ msg: "updated" });
    } else if (A.n == 0) {
      return res.status(404).send({ msg: "appointment not found" });
    }
    res.send({ msg: "there is no modification" });
  } catch (error) {
    res.status(500).send({ msg: "can not modify it" });
  }
};

const get_one_appointment = async (req, res) => {
  const id = req.params.id;
  try {
    const appointment = await Appointement.findById(id);
    res.status(200).send({ msg: "appointment", appointment });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


module.exports = {
  appointment_create_post,
  appointment_delete,
  get_appointment,
  UpdateAppointement,
  get_one_appointment,
};
