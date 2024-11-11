// controller for adding a new property
const { uploadtos3 } = require('../image/uploadtos3');
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
    try {
        // Assuming `property_image` is a base64 string (remove data URI prefix for AWS S3)
        const base64Data = Buffer.from(inputs.property_image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const imageUrl = await uploadtos3(base64Data, `${Date.now()}-${inputs.property_name}.jpg`, 'image/jpeg');

        // Save image URL in the database
        let property = await Property.create({
            property_name: inputs.property_name,
            property_price: inputs.property_price,
            property_address: inputs.property_address,
            property_baths: inputs.property_baths,
            property_beds: inputs.property_beds,
            property_area: inputs.property_area,
            property_owner: inputs.property_owner,
            property_image: imageUrl,  // Store URL instead of data URL
            property_description: inputs.property_description,
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
