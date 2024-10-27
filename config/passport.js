const passport = require("passport"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  LocalStrategy = require("passport-local").Strategy,
  md5 = require("md5");

var EXPIRES_IN_MINUTES = "30d"; // 60 * 24;
var SECRET = process.env.TOKEN_SECRET;
var ALGORITHM = "HS256";
var ISSUER = "iot-konnect.com";
var AUDIENCE = "iot-konnect.com";

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passportField: "password",
    },
    async function (username, password, cb) {
      try {
        var user = await User.findOne({
          where: {
            user_email: username,
          },
        });

        if (!user)
          return cb(null, false, {
            message: "Username not found",
          });

        await sails.helpers.passwords.checkPassword(
          password,
          user.user_password
        );

        user = user.toPublicJSON();

        if (user.check_code) throw new Error("Account not verified.");

        return cb(null, user, {
          message: "Login Successful.",
        });
      } catch (ex) {
        console.log({ ex });
        return cb(ex);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: SECRET,
      issuer: ISSUER,
      audience: AUDIENCE,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async function (payload, cb) {
      try {
        var user = await User.findOne({
          where: {
            user_id: payload.id,
          },
        });

        //if (err) return cb(err);
        if (!user)
          return cb(null, false, {
            message: "Username not found",
          });

        user = user.toPublicJSON();

       
        return cb(null, user, {});
      } catch (ex) {
        return cb(ex);
      }
    }
  )
);

module.exports.jwtSettings = {
  expiresInMinutes: EXPIRES_IN_MINUTES,
  secret: SECRET,
  algorithm: ALGORITHM,
  issuer: ISSUER,
  audience: AUDIENCE,
};
