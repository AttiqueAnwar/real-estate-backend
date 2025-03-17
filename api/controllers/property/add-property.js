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
      type: "number",
      required: true,
    },
    property_owner: {
      type: "string",
      required: true,
    },
    property_image: {
      type: "ref", // Assuming this will be an array of base64 strings
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
        // Assuming `property_image` is an array of base64 strings
        const imageUrls = await Promise.all(inputs.property_image.map(async (image, index) => {
            const base64Data = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
            const imageUrl = await uploadtos3(base64Data, `${Date.now()}-${Date.now()}-${inputs.property_name}-${index}.jpg`, 'image/jpeg');
            return imageUrl;
        }));
        // Save image URL in the database
        let property = await Property.create({
            property_name: inputs.property_name,
            property_price: inputs.property_price,
            property_address: inputs.property_address,
            property_baths: inputs.property_baths,
            property_beds: inputs.property_beds,
            property_area: inputs.property_area,
            property_owner: inputs.property_owner,
            property_image: imageUrls.join(','),  // Store URLs as a comma-separated string
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
