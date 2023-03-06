const express = require("express");
const router = express.Router();
const user = require('../models/user')



//create a user 
  router.post("/",async(req,res)=>{
    const {  Prenom,  Address,  Mail, Telephone}=req.body
   try{
     const user=await user.create({Prenom,  Address,  Mail, Telephone})
     res.status(200).json(user)
    }
   catch(error){
    res.status(400).json({error:error.message})

  }});
  router.get("/", (req, res, next) => {
    res.status(200).json({
      message: "Hello World!",
    })});
 

//  router.post('/create', (req, res) => {
//    const { Prenom,  Address,  Mail, Telephone } = req.body;

//    res.status(201).json({ message: 'User created successfully' });
// });

module.exports = router;
