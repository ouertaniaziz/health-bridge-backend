const express = require("express");
const app = express();

// Chargement des variables d'environnement à partir du fichier .env
require("dotenv").config();

// Connexion à la base de données MongoDB
const connectDB = require("./db");
connectDB();

// Configuration de vos routes
const routes = require("./routes");
app.use("/", routes);

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

module.exports = app;
