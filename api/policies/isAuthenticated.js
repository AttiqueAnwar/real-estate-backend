
var passport = require('passport');

module.exports = async function (req, res, next) {

  passport.authenticate('jwt', function (error, user, info) {
    if (error) return res.serverError(error);
    if (!user)
     return res.unauthorized();
   req.user = user;
   next();
  })(req, res);

};
