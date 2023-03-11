const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const cors = require("cors");
const dotenv = require("dotenv");
const { verifyToken } = require("./middleware/authjwt");
var bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(cors( { origin: "http://localhost:3000" } ));
app.use(express.json());
app.use("/api", router);
app.use(verifyToken);

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

module.exports=app;