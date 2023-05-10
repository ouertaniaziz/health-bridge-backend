const express = require("express");
const { PythonShell } = require("python-shell");

const prediction = async (req, res) => {
  let gendre;
  let region;
  let smoker;
  if (req.body.sex == "male") {
    gendre = 1;
  } else {
    gendre = 2;
  }
  if (req.body.region == "northeast") {
    region = 1;
  } else if (req.body.region == "northwest") {
    region = 2;
  } else if (req.body.region == "southeast") {
    region = 3;
  } else region = 4;
  if (req.body.smoker === true) {
    smoker = 1;
  } else smoker = 2;

  const bmi = req.body.poids / req.body.taille;
  const options = {
    pythonOptions: ["-u"],
    scriptPath:
      "C:/Users/21626/OneDrive/Documents/4twins2/PI/health-bridge-backend/public/ML_Model",
    args: [req.body.age, gendre, bmi, req.body.children, smoker, region],
  };

  PythonShell.run("script.py", options).then((messages) => {
    try {
      const modelJson = messages[0].substring(1, messages[0].length - 1);
      console.log(modelJson);
      res.status(200).json(parseFloat(modelJson));
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

module.exports = { prediction };
