const jwt = require('jsonwebtoken');
const TeacherRegister = require('../Model/teacherRegister');


const Techauth = (req, res, next) => {
    var token = req.cookies.jwt;
    var verifyUser = jwt.verify(token, process.env.SECRETE_KEY2)
    var user = TeacherRegister.findOne({ _id: verifyUser._id }).then(function (data) {
        req.token = token;
        req.user = user;
        next();
        console.log("Token is verified")
    }).catch(function (err) {
        if (res.this != undefined) {
            res.this.status(401).send(err);
        }
        else {
            res.send("<h1>You can't see this page without login. So Please login first</h1>")
        }
    })
}
module.exports = Techauth;