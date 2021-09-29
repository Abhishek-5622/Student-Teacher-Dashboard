// ********************Passport jwt*********************

var JwtStrategy = require('passport-jwt').Strategy;
var UserRegister = require("../Model/register")
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

module.exports = function (passport) {
    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        UserRegister.findOne({ _id: jwtPayload._id }).then(function (data) {
            return done(null, data);
        }).catch(function (err) {
            console.log(err)
            return done(err, false);
        })
    }))
}