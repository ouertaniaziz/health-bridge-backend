const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const blog = require('./routes/blog-routes')
const cors = require("cors");
const dotenv = require("dotenv");
const prescriptionrouter= require('./routes/prescription-routes');
const patientrouter = require('./routes/patient-routes');
const appointementrouter = require('./routes/appointement-routes');
const donor = require('./routes/donor-router');
const doctor = require('./routes/doctor-routers')

const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3001" }));

app.use(express.json());

app.use("/api", router);
app.use("/api", doctor);
app.use("/api", blog);
app.use("/api", prescriptionrouter);
app.use("/api", patientrouter);
app.use("/api", appointementrouter);
app.use("/api", donor);

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
