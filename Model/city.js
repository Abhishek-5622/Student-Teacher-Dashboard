// For City Modal

// require
const mongoose = require('mongoose');
const validator = require('validator');

// create schema
const CitySchema = new mongoose.Schema(
    {
        city:{
            type:String,
            required:true,
            trim:true
        },
        region: {
            type: String,
            required: true,
            trim:true
        }
    }
)

// create collection(table)
const CityRegister = new mongoose.model("CityRegister", CitySchema);
// export the object
module.exports = CityRegister;
