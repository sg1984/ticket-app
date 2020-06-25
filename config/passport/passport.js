var bCrypt = require("bcrypt-nodejs");
const jsonMessagesPath = __dirname + "/../../assets/jsonMessages/";
var jsonMessages = require(jsonMessagesPath + "login");
const config = require("../login_config");
const User = require("../../models/user");

module.exports = function (passport, user) {
  var User = user;
  var LocalStrategy = require("passport-local").Strategy;

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      (req, email, passwordRequest, done) => {
        var User = user;
        var isValidPassword = function (userpass, passwordRequest) {
          return bCrypt.compareSync(passwordRequest, userpass);
        };
        User.findOne({ where: { email: email } })
          .then(function (user) {
            if (!user) {
              return done(null, false, jsonMessages.user.email);
            }
            if (!isValidPassword(user.password, passwordRequest)) {
              return done(null, false, jsonMessages.user.password);
            }

            var userinfo = { ...user.get(), ...config.toAuthJSON(user) };
            console.log("userinfo", userinfo);

            if (!userinfo.isActive) {
              return done(null, false, jsonMessages.user.unauthorized);
            }

            const { password, ...userWithoutPassword } = userinfo;

            return done(null, userWithoutPassword);
          })
          .catch(function (err) {
            console.log("Error:", err);

            return done(null, false, jsonMessages.user.error);
          });
      }
    )
  );
};
