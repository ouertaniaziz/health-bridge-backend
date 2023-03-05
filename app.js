const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);


// Chargement des variables d'environnement à partir du fichier .env
require("dotenv").config();




// Configuration de vos routes
const routes = require("./routes");
app.use("/", routes);
//middlware
// app.use(exprerss.json());
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

//connect to db 

 mongoose.connect(process.env.MONGO_URI)
 .then(()=>{app.listen(process.env.DB_PORT,()=>{
  console.log(' connected to db listening on port',process.env.DB_PORT)
})})
 .catch((error)=>{
   console.log(error)
 })






module.exports = app;
