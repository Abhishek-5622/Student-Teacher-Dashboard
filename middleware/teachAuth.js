const jwt = require('jsonwebtoken');
const TeacherRegister = require('../Model/teacherRegister');

const Techauth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRETE_KEY2)
        const user = await TeacherRegister.findOne({ _id: verifyUser._id })
        req.token = token;
        req.user = user;
        next();
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
module.exports = Techauth;