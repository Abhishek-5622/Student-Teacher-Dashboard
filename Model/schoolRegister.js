// For School Modal

// require
const mongoose = require('mongoose');
const validator = require('validator');
// create schema
const SchoolSchema = new mongoose.Schema(
    {
        schoolname: {
            type: String,
            required: true,
            trim:true
        },
        schoolemail: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email',
                isAsync: false
            }
        },
      
        city: {
            type: String,
            required: true,
            trim:true
        }
        ,
        region: {
            type: String,
            required: true,
            trim:true
        },
        area: {
            type: String,
            required: true,
            trim:true
        },

    }
)

// create collection(table)
const SchoolRegister = new mongoose.model("SchoolRegister", SchoolSchema);
// export the object
module.exports = SchoolRegister;
