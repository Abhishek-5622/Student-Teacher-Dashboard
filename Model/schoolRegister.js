// For school

// require
const mongoose = require('mongoose');
const validator = require('validator');
// create schema
const SchoolSchema = new mongoose.Schema(
    {
        schoolname: {
            type: String,
            require: true
        },
        schoolemail: {
            type: String,
            require: true,
            unique: true,
            validate:{
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email',
                isAsync: false
              }
        },
        area: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        }
        
    }
)



// create collection(table)
const SchoolRegister = new mongoose.model("SchoolRegister", SchoolSchema);

// export the object
module.exports = SchoolRegister;