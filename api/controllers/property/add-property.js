// controller for adding a new property

module.exports = {
  friendlyName: "Add property",
  description: "",
  inputs: {
    property_name: {
      type: "string",
      required: true,
    },
    FK_user_id: {
      type: "number",
      required: true,
    },
  },
  exits: {
    exception: {
      responseType: "exception",
    },
    success: {
      responseType: "success",
    },
    notFound: {
      responseType: "notFound",
    },
    conflict: {
      responseType: "conflict",
    },
  },

  fn: async function (inputs, exits) {
    let { req } = this;
    console.log(req.user);
    console.log(inputs);
    let { property_name, FK_user_id } = inputs;


    try {
      let property = await Property.create({
        property_name,
        FK_user_id,
      });

      return exits.success({
        message: "Property added successfully",
        data: property,
      });

    } catch (err) {
      console.log({ err });
      return exits.exception({
        message: err.message,
        err,
      });
    }
  },
};
