// controller for adding a new property

module.exports = {
  friendlyName: "Add property",
  description: "",
  inputs: {
    property_name: {
      type: "string",
      required: true,
    },
    property_price: {
      type: "number",
      required: true,
    },
    property_address: {
      type: "string",
      required: true,
    },
    property_baths: {
      type: "number",
      required: true,
    },
    property_beds: {
      type: "number",
      required: true,
    },
    property_area: {
      type: "string",
      required: true,
    },
    property_owner: {
      type: "string",
      required: true,
    },
    property_image: {
      type: "string",
      required: true,
    },
    property_description: {
      type: "string",
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
    let { property_name,
      property_price,
      property_address,
      property_baths,
      property_beds,
      property_area,
      property_owner,
      property_image,
      property_description } = inputs;


    try {
      let property = await Property.create({
        property_name,
        property_price,
        property_address,
        property_baths,
        property_beds,
        property_area,
        property_owner,
        property_image,
        property_description
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
