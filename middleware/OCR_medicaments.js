const mindee = require("mindee");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require("fs");
const Pharmacist = require("../model/Pharmacist");
const Storagemed=require("./../model/Storagemed");
// Init a new client and add your document endpoint 
const mindeeClient = new mindee.Client({ apiKey: "e3c7cb0108ca85dad83f14c857abb9e9" })
.addEndpoint({
    accountName: "malekzlt",
    endpointName: "medicament_name",
});

const getmedicament_from_image = async (req, res) => {
try{
    const pharmacistid=req.body._id
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
          .parse(mindee.CustomV1, { endpointName: "medicament_name" });
        apiResponse.then(async (resp) => {
          if (resp.document === undefined) return;
            
            let medicament_name=resp.document.fields.get("medicament_name").toString()
            let doesage=resp.document.fields.get("dosage").toString()
        let pharmacist = await Pharmacist.findOne({ _id: req.body._id });
        console.log(pharmacist)
        console.log('hello')
        if (!pharmacist) {
          return res.status(400).json({ message: "Pharmacist not found" });
        }
        const stock=new Storagemed({medicationname:medicament_name,Dosage:doesage})
        await stock.save();
        pharmacist.medicamentsinstock.push(stock);
        let phar=await pharmacist.save();
        console.log(phar)

        })        
    })
        //console.log(x)
        //req.file.buffer = null;
        res.status(200).json({ message: "success", status: true });

}
catch(err){
res.send(err.message)
}

}
module.exports = { getmedicament_from_image };