const express = require("express");
const app = express();
const mongoose = require("mongoose");

 mongoose.set('strictQuery', false);


// Chargement des variables d'environnement à partir du fichier .env
require("dotenv").config();

// Configuration de vos routes
const usersroutes=require('./routes/users');
app.use("/api", usersroutes);
//middlware
app.use(express.json())
app.use((req,res,next)=>{
  console.log(req.path,req.method)
  next()
})

// Gestion des erreurs 404
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

//import database var mongoose =
require('mongoose'); var
configDB=require('./database/mongodb.json');
//mongo config const connect =

mongoose.connect(
configDB.mongo.uri ,
{ useNewUrlParser:
true ,
useUnifiedTopology: true
},
()=> console.log("Connected to DB !!") );



module.exports = app;
