module.exports = {
  friendlyName: "Login",

  description: "Login user.",

  inputs: {
    username: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: "string",
      required: true
    },

    password: {
      description:
        'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: "string",
      required: true
    }
  },

  exits: {
    badCombo: {
      description: `The provided email and password combination does not
      match any user in the database.`,
      responseType: "unauthorized"
    },
    exception: {}
  },

  fn: async function(inputs, exits) {
    var passport = require("passport");
    var { req, res } = this;
    passport.authenticate("local", function(err, user, info) {
      if (err || !user) {
        return exits.exception(err);
      }

      return exits.success({ user, token: TokenService.createToken(user) });
    })(req, res);
    // var userRecord = await User.findOne({where:{
    //   user_email: inputs.email,
    // }});

    // // If there was no matching user, respond thru the "badCombo" exit.
    // if(!userRecord) {
    //   throw 'badCombo';
    // }

    // If the password doesn't match, then also exit thru "badCombo".
  }
};
