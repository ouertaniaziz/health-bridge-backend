const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const blog = require("./routes/blog-routes");
const traitement = require("./routes/traitement-routes");
const adminpolyclinic = require("./routes/adminpolyclinic-routes");
const cors = require("cors");
const pharmacist = require("./routes/pharmacist-routes");
const dotenv = require("dotenv");
const prescriptionrouter = require("./routes/prescription-routes");
const patientrouter = require("./routes/patient-routes");

const appointementrouter = require("./routes/appointement-routes");
const donor = require("./routes/donor-router");
const doctor = require("./routes/doctor-routers");
const predection = require("./routes/predection-routes");

const bodyParser = require("body-parser");
//chat

const Room = require("./model/room");
const Message = require("./model/message");
//
dotenv.config();

const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3001" },
});
// global.io = new Server(server, {
//   cors: { origin: "*" },
// });

// io.on("connection", (socket) => {
//   console.log("user connected", socket.id);
//   socket.on("notification", (data) => {
//     console.log(data);
//     socket.broadcast.emit("recive", data);
//   });

// Here, you can send the notification to the appropriate user(s).
// You can use the socket.emit() method to send a message to a specific socket,
// or the io.emit() method to broadcast a message to all connected sockets.
//});
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
app.use("/api", predection);
app.use("/api", adminpolyclinic);

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
/////chat
//chatroom

const validateForm = require("./middleware/validateFormMiddleware");

//
app.get("/", (req, res) => {
  Room.find({}, (err, rooms) => {
    if (err) return console.log(err);
    res.json(rooms);
  });
});
//
// create a new room

app.post("/rooms", validateForm, (req, res) => {
  let roomName = req.body["roomName"];
  let generatedRoom = new Room({ name: roomName });

  generatedRoom.save((err, res) => {
    if (err) return console.log(err);
  });

  res.status(201);
  res.end();
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    Message.find({ room: data }).then((result) => {
      socket.emit("output-messages", result);
    });
  });

  socket.on("message", (data) => {
    let author = data.author;
    let message = data.message;
    let id = data.room;

    Room.findOne({ _id: id }).then((room) => {
      let generatedMessage = new Message({ author, message, room });
      generatedMessage.save((err, res) => {
        if (err) return console.log(err);
      });
      io.emit("message", generatedMessage);
    });
  });
});

///////////////
//////////////////////////////
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port: ${process.env.PORT || 5000}`);
});

module.exports = app;
