const express = require("express");
const router = express.Router();
const controller = require("../controllers/donor-controller");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const cors = require("cors");



// Create a new donor
router.post('/donation/addMedication', controller.addMedication);

// Get all donors
router.post('/donation/addMaterial', controller.addMaterial);

router.get('/donation', controller.getAllDonors);
router.get('/donation/totaldonors',controller.getTotalDonors);
router.get('/donation/MostDonatedMaterial',controller.mostDonatedMaterial)
router.get('/donation/MostDonatedMedication',controller.mostDonatedMedication)
router.post("/donation/payment", cors(), async (req, res) => {
	let { amount, id } = req.body;
	try {
	  // Retrieve the PaymentMethod information
	  const paymentMethod = await stripe.paymentMethods.retrieve(id);
	  console.log("PaymentMethod", paymentMethod);
  
	  const payment = await stripe.paymentIntents.create({
		amount,
		currency: "USD",
		description: "Spatula company",
		payment_method: id,
		confirm: true
	  });
	  console.log("Payment", payment);
	  res.json({
		message: "Payment successful",
		success: true
	  });
	} catch (error) {
	  console.log("Error", error);
	  res.json({
		message: "Payment failed",
		success: false
	  });
	}
  });

module.exports = router;