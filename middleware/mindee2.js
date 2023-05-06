const mindee = require("mindee");
const multer = require("multer");
const fs = require("fs");
const User = require("../model/User");
const pharmacist = require("../model/pharmacist");

// Create a Multer storage object that keeps uploaded files in memory
const storage = multer.memoryStorage();

// Create a Multer instance with the storage options
const upload = multer({ storage: storage });

// Init a new client and add your document endpoint
const mindeeClient = new mindee.Client({ apiKey: "my-api-key-here" })
.addEndpoint({
    accountName: "malekzlt",
    endpointName: "medicament_name",
});

// Load a file from disk and parse it
const apiResponse = mindeeClient
  .docFromPath("/path/to/the/file.ext")
  .parse(mindee.CustomV1, { endpointName: "medicament_name" });

// Print a brief summary of the parsed data
apiResponse.then((resp) => {

    if (resp.document === undefined) return;

    // full object
    console.log(resp.document);

    // string summary
    console.log(resp.document.toString());
});
