const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const Record = require("../model/Record");
const User = require("../model/User");

const uploadfilepatient = async (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
      cb(null, "uploads/"); // replace with your upload directory
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
      // console.log(file.originalname);
    },
  });

  const upload = multer({ storage });

  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(500).send(err.message);
    } else if (err) {
      // An unknown error occurred when uploading
      console.log(err);
      return res.status(500).send(err.message);
    }
    const username = req.body.username;
    const user = await User.findOne({ username: username });
    console.log(user._id);
    const file = req.file;
    const imagePath = req.file.path;

    // Read the image file as a binary buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Convert the binary buffer to a base64-encoded string
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    const record = new Record({
      patient: user._id,
      filename: file.filename,
      file: base64Image,
    });
    record.save();

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    res.status(200).send("File uploaded successfully");
  });
};
module.exports = { uploadfilepatient };
