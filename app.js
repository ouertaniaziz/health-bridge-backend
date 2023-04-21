const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const donationroute = require("./routes/Donor-routes");

const cors = require("cors");
const dotenv = require("dotenv");
const prescriptionrouter = require("./routes/prescription-routes");
const patientrouter = require("./routes/patient-routes");
const doctorrouter = require("./routes/doctor-routers");
const appointementrouter = require("./routes/appointement-routes");
const postrouter = require("./routes/post-routes");
const doctor = require("./routes/doctor-routers");

var bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3001" }));

app.use(express.json());

app.use("/api", router);
app.use("/api", donationroute);

app.use("/api", prescriptionrouter);
app.use("/api", patientrouter);
app.use("/api", doctorrouter);
app.use("/api", appointementrouter);
app.use("/api", postrouter);
app.use("/api", doctor);

// parse requests of content-type - application/json
app.use(bodyParser.json());

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to MongoDB database!");
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port: ${process.env.PORT || 5000}`);
});

module.exports = app;
