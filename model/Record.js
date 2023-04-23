const mongoose = require("mongoose");

const recordschema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      
})
