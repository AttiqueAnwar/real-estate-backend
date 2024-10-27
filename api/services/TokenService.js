var jwt = require('jsonwebtoken');
module.exports = {
  createToken: function(user)
  {
    return jwt.sign({
        id: user.user_id,
        appId: "iot-konnect.com"
      },
      sails.config.jwtSettings.secret,
      {
        algorithm: sails.config.jwtSettings.algorithm,
        expiresIn: sails.config.jwtSettings.expiresInMinutes,
        issuer: sails.config.jwtSettings.issuer,
        audience: sails.config.jwtSettings.audience
      }
    );
  }
}
