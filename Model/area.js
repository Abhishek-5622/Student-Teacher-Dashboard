// For city

// require
const mongoose = require('mongoose');
const validator = require('validator');
// create schema

const AreaSchema = new mongoose.Schema(
    {
        area :{
            type:String,
            require:true
        },
        city: {
            type: String,
            require: true,
        }
    }
)

// create collection(table)
const AreaRegister = new mongoose.model("AreaRegister", AreaSchema);
// export the object
module.exports = AreaRegister;
