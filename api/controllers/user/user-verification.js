module.exports = {


  friendlyName: 'User verification',


  description: '',


  inputs: {
    check_code: {
      description: '',
      type: 'string',
      required: true
    },
    user_email: {
      description: '',
      type: 'string',
      required: true
    }
  },


  exits: {
    exception: {
      responseType: 'exception'
    },
    notFound: {
      responseType: 'notFound'
    },
    success: {
      responseType: 'success'
    }
  },

  //VERIFY USER
  fn: async function (inputs, exits) {
    try {
      var user = await User.findOne({
        where: {
          user_email: inputs.user_email,
          check_code: inputs.check_code
        }
      });
      if (!user)
        return exits.notFound('User not found.');

      await user.update({
        check_code: '',
        status_id: 1
      });
      return exits.success({
        message: "Your account has been registered"
      });
    } catch (ex) {
      return exits.exception({
        status: 500,
        message: ex.message
      });
    }

  }


};
