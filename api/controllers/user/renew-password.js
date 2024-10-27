module.exports = {


  friendlyName: 'Renew password',


  description: '',


  inputs: {
    check_code: {
      description: '',
      type: 'string',
      required: true
    },
    user_password: {
      description: '',
      type: 'string',
      required: true
    },
    retype_user_password: {
      description: '',
      type: 'string',
      required: true
    }
  },


  exits: {
    exception: {
      responseType: 'exception'
    },
    success: {
      responseType: 'success'
    },
    notFound: {
      responseType: 'notFound'
    },
    conflict: {
      responseType: 'conflict'
    }
  },


  fn: async function (inputs, exits) {

    try {
      if (inputs.user_password.trim() !== inputs.retype_user_password.trim()) return exits.conflict("Password & Confirm password doesn't match.");
      const user = await User.findOne({
        where: {
          check_code: inputs.check_code
        }
      });
      if (!user) return exits.notFound('User not found');
      await user.update({
        check_code: null,
        user_password: inputs.user_password
      });
      return exits.success();
      // }else{
      // var error = JSON.stringify({status:404,message:sails.__("User not found")});
      // throw new Error(error);

      // }
    } catch (ex) {
      return exits.exception({
        status: 500,
        message: ex.message
      });
    }

  }


};
