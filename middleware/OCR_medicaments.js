const mindee = require("mindee");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require("fs");
const Pharmacist = require("../model/Pharmacist");
const Storagemed=require("./../model/Storagemed");
const Buffer= require('buffer').Buffer;
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
        //console.log("Received file:", req.body);
        //let correct=JSON.stringify(file)
        console.log(req.body);
        // Convert the image buffer to a base64 string
        //fs.writeFile('./image.png', imageBuffer);
        //let stringdata=file.toString('base64')
        let apiResponse = mindeeClient
          .docFromBase64(req.body.file,'image.jpg')
          .parse(mindee.CustomV1, { endpointName: "medicament_name" });
        apiResponse.then(async (resp) => {
          if (resp.document === undefined) return;
            console.log(resp.document.fields.get("medicament_name").toString())
            let medicament_name=resp.document.fields.get("medicament_name").toString()
            let doesage=resp.document.fields.get("dosage").toString()
        let pharmacist = await Pharmacist.findOne({ user: req.body._id });
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