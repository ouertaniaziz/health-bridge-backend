const express = require("express");
const { PythonShell } = require("python-shell");

const options = {
  pythonOptions: ["-u"],
  scriptPath:
    "C:/Users/21626/OneDrive/Documents/4twins2/PI/health-bridge-backend/public/ML_Model",
  args: [35, 1, 24.5, 1, 1, 2],
};

const prediction = async (req, res) => {
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
