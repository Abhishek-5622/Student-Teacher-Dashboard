// For school

// require
const mongoose = require('mongoose');
const validator = require('validator');
// create schema
const SchoolSchema = new mongoose.Schema(
    {
        schoolname: {
            type: String,
            require: true,
            trim:true
        },
        schoolemail: {
            type: String,
            require: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email',
                isAsync: false
            }
        },
      
        city: {
            type: String,
            require: true,
            trim:true
        }
        ,
        region: {
            type: String,
            require: true,
            trim:true
        },
        area: {
            type: String,
            require: true,
            trim:true
        },

    }
)







// create collection(table)
const SchoolRegister = new mongoose.model("SchoolRegister", SchoolSchema);
// export the object
module.exports = SchoolRegister;
