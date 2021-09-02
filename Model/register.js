// For student


// require
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require("dotenv").config();

// create schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
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
userSchema.methods.generateAuthToken = function () {
    // it take 2 parameter : payload => id and secrete key of 32 character
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRETE_KEY1);
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
const UserRegister = new mongoose.model("UserRegister", userSchema);

// export the object
module.exports = UserRegister;