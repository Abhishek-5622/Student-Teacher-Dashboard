// For Admin Model

// require
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const validator = require('validator');
require("dotenv").config();

// create schema
const AdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim:true
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
        password: {
            type: String,
            required: true,
            trim:true
        },
    }
)

// generate token
AdminSchema.methods.generateAuthToken = function () {
    // it take 2 parameter : payload => id and secrete key of 32 character
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRETE_KEY1);
    // save in db
    this.save().then(function () {
        console.log("token save")
    }).catch(function (err) {
        console.log(err)
    })
    return token;
}

// create collection(table)
const adminRegister = new mongoose.model("adminRegister", AdminSchema);

// export the object
module.exports = adminRegister;