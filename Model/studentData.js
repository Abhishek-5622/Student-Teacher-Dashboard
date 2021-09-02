// For student Data


// require
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require("dotenv").config();

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
            unique: true
        },
        mobileNo: {
            type: Number,
            require: true
        },
        address: {
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
            require: true
        },
        marks: {
            maths: {
                type: Number,
                require: true
            },
            science: {
                type: Number,
                require: true
            },
            english: {
                type: Number,
                require: true
            },
            hindi: {
                type: Number,
                require: true
            },
            sst: {
                type: Number,
                require: true
            }
        }


    }
)



// create collection(table)
const studentData = new mongoose.model("studentData", studentDataSchema);

// export the object
module.exports = studentData;