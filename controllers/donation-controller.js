const User = require('../model/User');
const Donation = require('../model/Donation');
const Material = require('../model/Material');
const Medication = require('../model/Medication');

const addDonationToUser = async (req, res) => {
  try {     
    const u = req.body.firstname + "a";
    const user = new User({
      username:u,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email
    });

    await user.save();

    const newDonation = new Donation({
      name: req.body.name,
      phone: req.body.phone,
      user: user._id,
      donationtype: req.body.donationtype,
      medications: req.body.medications,
      materials: req.body.materials
    });

    if (req.body.donationtype === "materials") {
      const material = new Material({
        donation: newDonation._id,
        materialname: req.body.materialname,
        state: req.body.state,
        quantity: req.body.quantity,
      });

      await material.save();
      newDonation.materials.push(material);
    }

    if (req.body.donationtype === "medications") {
      const medication = new Medication({
        donation: newDonation._id,
        medicationname: req.body.medicationname,
        validationPeriod: req.body.validationPeriod,
        numPackets: req.body.numPackets,
        description: req.body.description,
      });

      await medication.save();
      newDonation.medications.push(medication);
    }

    await newDonation.save();

    res.status(201).json({ donation: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getDonationAnalytics = async (req, res) => {
    try {
      const donations = await Donation.find();
      const medications = await Medication.find();
      const materials = await Material.find();
  
      const totalDonations = donations.length;
      const totalQuantityDonated = 
  donations.reduce( 
    (acc, cur) => acc + cur.quantity, 
    0 
  );
      const mostDonatedMedication = donations.reduce((prev, cur) => (prev.quantity > cur.quantity ? prev : cur));
  
      const medicationStock = medications.reduce((acc, cur) => {
        acc[cur.name] = cur.quantity;
        return acc;
      }, {});
  
      const materialStock = materials.reduce((acc, cur) => {
        acc[cur.name] = cur.quantity;
        return acc;
      }, {});
  
      res.json({
        totalDonations,
        totalQuantityDonated,
        mostDonatedMedication,
        medicationStock,
        materialStock,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  };

module.exports = { addDonationToUser, getDonationAnalytics };
