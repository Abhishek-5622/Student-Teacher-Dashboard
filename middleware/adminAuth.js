// ******************************Auth for user**********************

// require jwt and schema
const jwt = require('jsonwebtoken');
const adminRegister = require('../Model/adminRegister');

// authenication
// 1. cookies se token get kiya
// 2. verify token n secrete key
// 3 check the the token is present in our db or not
// 4 call next function
const adminauth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRETE_KEY3)
        const user = await adminRegister.findOne({ _id: verifyUser._id })

        req.token = token;
        req.user = user;
        next();
        console.log("Token is verified")
    }
    catch (error) {
        if (res.this != undefined) {
            res.this.status(401).send(error);
        }
        else {
            res.send("<h1>You can't see this page without login. So Please login first</h1>")
        }
    }
}
module.exports = adminauth;