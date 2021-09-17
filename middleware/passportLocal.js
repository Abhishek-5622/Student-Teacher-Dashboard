var LocalStrategy = require('passport-local').Strategy;
var UserRegister = require("../Model/register");
  

  module.exports = function (passport) {
    passport.use(new LocalStrategy(
        function(name, password, done) {
            UserRegister.findOne({ name: name,password:password }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
          });
        }
      ));
   
    
}