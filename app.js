const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const blog = require("./routes/blog-routes");
const traitement = require("./routes/traitement-routes");
const pharmacist = require("./routes/pharmacist-routes");
const dotenv = require("dotenv");
const prescriptionrouter = require("./routes/prescription-routes");
const patientrouter = require("./routes/patient-routes");
const donor = require("./routes/donor-router");
const doctor = require("./routes/doctor-routers");
const material = require("./routes/material-routes");
const medication=require("./routes/medication-routes")
const appointementrouter = require("./routes/appointement-routes");

const bodyParser = require("body-parser");


const cors = require("cors");

dotenv.config();

const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3001" },
});
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("notification", (data) => {
    console.log(data);
    socket.broadcast.emit("recive", data);
  });

  // Here, you can send the notification to the appropriate user(s).
  // You can use the socket.emit() method to send a message to a specific socket,
  // or the io.emit() method to broadcast a message to all connected sockets.
});
app.use(cors({ origin: "http://localhost:3001" }));

app.use(express.json());

app.use("/api", router);
app.use("/api", doctor);
app.use("/api", pharmacist);
app.use("/api", blog);
app.use("/api", prescriptionrouter);
app.use("/api", patientrouter);
app.use("/api", appointementrouter);
app.use("/api", donor);
app.use("/api", traitement);
app.use("/api", material);
app.use("/api", medication);
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

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port: ${process.env.PORT || 5000}`);
});

module.exports = app;
