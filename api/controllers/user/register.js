module.exports = {


  friendlyName: 'Register',


  description: 'Register user.',


  inputs: {
    username: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      required: true,
      isEmail: true
    },
    password: {
      description: 'password',
      type: 'string',
      required: true
    },
    firstname: {
      description: 'first name',
      type: 'string',
      required: true
    },
    lastname: {
      description: 'last name',
      type: 'string',
      required: true
    },
    user_metrics: {
      description: 'user matrics',
      type: 'string'
    },
    user_timezone: {
      description: 'user time zone',
      type: 'string'
    },
    FK_role_id: {
      description: 'FK_role_id',
      type: 'number'
    },
    parent_id: {
      description: 'parent id',
      type: 'number'
    },
  },


  exits: {
    exception: {
      responseType: 'exception'
    },
    success: {
      responseType: 'success'
    }
  },

  // Add User
  fn: async function (inputs, exits) {
    let transaction;
    try {
      transaction = await User.sequelize.transaction();
      var createdUser = await User.create({
        user_first_name: inputs.firstname,
        user_last_name: inputs.lastname,
        user_email: inputs.username,
        user_password: inputs.password,
        status_id: 0,
        FK_user_type: 3,
        FK_role_id: (inputs.FK_role_id) ? inputs.FK_role_id : 5,
        parent_id: (typeof this.req.user != "undefined") ? this.req.user.id : 160,
        provider: "local"
      },{
        transaction
      });
      await transaction.commit();
      createdUser = createdUser.toPublicJSON();
      sails.emit("createdUser", createdUser);
    } catch (ex) {
      if(transaction) await transaction.rollback()
      // return exits.exception(parse(ex.message));
      return exits.exception({
        status: 500,
        message: ex.message
      });
    }
    return exits.success({
      data: createdUser
    });
  }
};
// SENDING USER A WELCOME EMAIL

sails.on('createdUser', (createdUser) => {
  //!!TODO: add config to env
  createdUser.verificationUrl =
    sails.config.custom.baseUrl + "/api/v1/en/user/verify/" + createdUser.user_email + "/" + createdUser.check_code;
  var mailOptions = {
    template: 'verificationTemplate',
    subject: 'Welcome Email',
    to: createdUser.user_email
  }
  MailService.queue(createdUser, mailOptions)
})
