// For school

// require
const mongoose = require('mongoose');
const validator = require('validator');
// create schema

const CitySchema = new mongoose.Schema(
    {
        city:{
            type:String,
            require:true
        },
        region: {
            type: String,
            require: true,
        }
    }
)


// create collection(table)
const CityRegister = new mongoose.model("CityRegister", CitySchema);
// export the object
module.exports = CityRegister;
