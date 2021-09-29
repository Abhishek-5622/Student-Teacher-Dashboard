// For student Data add

// require
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require("dotenv").config();
const validator = require('validator');

// Subject sub schema
const subjectSchema = new mongoose.Schema({
    title : String,
    marks : {
        type:Number,
        required:true,
        min:0,
        max:100
    }
});

// create schema
const studentDataSchema = new mongoose.Schema(
    {
        rollNo: {
            type: Number,
            required: true,
            unique:true
        },
        name: {
            type: String,
            required: true,
            trim:true
        },
        date:{
            type: Date,
            required:true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email',
                isAsync: false
            }
        },
        mobileNo: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
            trim:true
        },
        area: {
            type: String,
            required: true,
            trim:true
        },
        motherName: {
            type: String,
            required: true,
            trim:true
        },
        fatherName: {
            type: String,
            required: true,
            trim:true
        },
        classCoordinator: {
            type: String,
            required: true,
            trim:true
        },
        sclass: {
            type: String,
            required: true,
            trim:true
        },
        temail: {
            type: String,
            required: true,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email',
                isAsync: false
            }
        },
        school: {
            type: String,
            required: true
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