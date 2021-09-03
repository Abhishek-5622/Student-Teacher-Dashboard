// For teacher

// require
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require("dotenv").config();
const validator = require('validator');

// teacher db schema
const TeacherSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true,
            validate:{
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
TeacherSchema.methods.generateAuthToken = function () {
    // create token
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRETE_KEY2);
    // add in db
    this.tokens = this.tokens.concat({ token: token })
    // save 
    this.save().then(function () {
        console.log("token save")
    }).catch(function (err) {
        console.log("Token error" + err)
    })
    return token;
}

// create collection
const TeacherRegister = new mongoose.model("TeacherRegister", TeacherSchema);

// export object
module.exports = TeacherRegister;