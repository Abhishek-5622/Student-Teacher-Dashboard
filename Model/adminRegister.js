// For admin

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
            require: true,
            trim:true
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
        password: {
            type: String,
            require: true
        },
        tokens: [
            {
                token: {
                    type: String,
                    require: true
                }
            }
        ]
    }
)

// generate token
AdminSchema.methods.generateAuthToken = function () {
    // it take 2 parameter : payload => id and secrete key of 32 character
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRETE_KEY3);
    // add in our database
    this.tokens = this.tokens.concat({ token: token })
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