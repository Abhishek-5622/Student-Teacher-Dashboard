// For student Data


// require
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require("dotenv").config();
const validator = require('validator');

const subjectSchema = new mongoose.Schema({
    title : String,
    marks : Number
});

// create schema
const studentDataSchema = new mongoose.Schema(
    {
        rollNo: {
            type: Number,
            require: true
        },
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email',
                isAsync: false
            }
        },
        mobileNo: {
            type: Number,
            require: true
        },
        address: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        },
        area: {
            type: String,
            require: true
        },
        motherName: {
            type: String,
            require: true
        },
        fatherName: {
            type: String,
            require: true
        },
        classCoordinator: {
            type: String,
            require: true
        },
        sclass: {
            type: String,
            require: true
        },
        temail: {
            type: String,
            require: true,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email',
                isAsync: false
            }
        },
        school: {
            type: String,
            require: true
        },
        marks: [subjectSchema],
    }
)

studentDataSchema.path('mobileNo').validate(function validatePhone() {
    return (this.mobileNo > 999999999);
});


// create collection(table)
const studentData = new mongoose.model("studentData", studentDataSchema);

// export the object
module.exports = studentData;