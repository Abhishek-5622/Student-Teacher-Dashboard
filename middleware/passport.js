// ********************Passport jwt*********************

var JwtStrategy = require('passport-jwt').Strategy;
var UserRegister = require("../Model/register")
const TeacherRegister = require('../Model/teacherRegister');
const adminRegister = require('../Model/adminRegister');


function myPassport(passport, role) {
    var opts = {}
    opts.secretOrKey = process.env.SECRETE_KEY1;

    // Extract cookie function
    var cookieExtractor = (function (req) {
        var token = null;
        if (req && req.cookies) {
            token = req.cookies['jwt'];
        }
        return token;
    });
    opts.jwtFromRequest = cookieExtractor;

    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        console.log(JSON.parse(JSON.stringify(jwtPayload)))
        var model = '';
        if (role === 'student') {
            model = UserRegister;
        }
        else if (role === 'teacher') {
            model = TeacherRegister
        }
        else if (role === 'admin') {
            model = adminRegister;
        }
        model.findOne({ _id: jwtPayload._id }).then(function (data) {
            return done(null, data);
        }).catch(function (err) {
            console.log(err)
            return done(err, false);
        })
    }))
}

module.exports = myPassport