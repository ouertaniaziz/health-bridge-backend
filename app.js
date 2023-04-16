const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const doctorRouter = require("./routes/doctor-routes");

const cors = require("cors");
const dotenv = require("dotenv");

var bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());
app.use("/api", router);
app.use("/api/doctor", doctorRouter);

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
