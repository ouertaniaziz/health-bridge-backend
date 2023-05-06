const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    medicationName: {
        type: String,
        required: true,
    },

    Traitement: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Traitement",
        required: true,
      }],                               

    prescriptionRequired: {

        type: Boolean,
        required: true,

    },

    numpackets: {
        type : Number,
        required: true,

    },

});




const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;