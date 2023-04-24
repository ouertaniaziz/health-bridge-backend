const mindee = require("mindee");
const multer = require("multer");
const fs = require("fs");
const User = require("../model/User");
const Patient = require("../model/Patient");

// Create a Multer storage object that keeps uploaded files in memory
const storage = multer.memoryStorage();

// Create a Multer instance with the storage options
const upload = multer({ storage: storage });

// Init a new client and add your document endpoint
const mindeeClient = new mindee.Client({
  apiKey: "b280e5cb8c269c6e681683d3a4ec28e6",
}).addEndpoint({
  accountName: "houssembalti",
  endpointName: "tunisian_id",
});

// Print a brief summary of the parsed data
// apiResponse.then((resp) => {
//   if (resp.document === undefined) return;

//   // full object
//   console.log(resp.document);

//   // string summary
//   console.log(resp.document.toString());
// });

const getcin_from_image = async (req, res) => {
  try {
    var id_predicted;
    const username = req.body.username;
    console.log(req.body.username);

    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).send("Error uploading file");
      }
      const file = req.file;
      console.log("Received file:", file.originalname);

      //console.log(req.file);
      // Convert the image buffer to a base64 string

      const apiResponse = mindeeClient
        .docFromBase64(file.buffer.toString("base64"), file.originalname)
        .parse(mindee.CustomV1, { endpointName: "tunisian_id" });
      apiResponse.then(async (resp) => {
        if (resp.document === undefined) return;
        id_predicted = resp.document.fields.get("id").toString();
        //console.log(req.body.cin);
        console.log(id_predicted);
        //console.log(id_predicted == req.body.cin);
        const user = await User.findOne({ username: req.body.username });
        console.log(user._id)
        if (id_predicted == req.body.cin) {
          console.log("triggered");

          const updated = await Patient.findOneAndUpdate(
            { user: user._id },
            { cinverified: true, cin: id_predicted },
            {
              new: true,
            }
          );
          res.status(200).json({ message: "success", status: true });
        } else {
          //console.log('cin lena',user.firstname)

          res.status(404).json({ message: "failed", status: false });
        }

        req.file.buffer = null;
      });
    });
  } catch (error) {
    res.send(404).json({ error: error.message });
  }
  // Convert the image buffer to a base64 string
  //const base64String = file.toString("base64");
  // const apiResponse =  mindeeClient
  // .docFromBase64(image.toString('base64'))
  // .parse(mindee.CustomV1, { endpointName: "tunisian_id" });

  // apiResponse.then((resp) => {
  //   if (resp.document === undefined) return;

  //   // full object
  //   console.log(resp.document);

  //   // string summary
  //   res.send(resp.document.toString());
  //   console.log(resp.document.toString());
  // });
};
module.exports = { getcin_from_image };
