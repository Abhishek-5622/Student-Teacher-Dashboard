var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var UserRegister = require("../Model/register")

var opts = {}

opts.secretOrKey = process.env.SECRETE_KEY1;

var cookieExtractor = (function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
        console.log("myTok: " + token)
    }
    return token;
});
opts.jwtFromRequest = cookieExtractor;

module.exports = function (passport) {
    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        console.log(opts)
        console.log("jwtPayload " + JSON.stringify(jwtPayload._id))

        UserRegister.findOne({ _id: jwtPayload._id }).then(function (data) {
            console.log(data)

            return done(null, data);
        }).catch(function (err) {
            console.log(err)
            return done(err, false);
        })

    }
    )
    )
}