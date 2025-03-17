const { uploadtos3 } = require('../image/uploadtos3');

module.exports = {
  friendlyName: "Edit property",
  description: "Edit specified property details",
  inputs: {
    id: {
      type: "number",
      required: true,
      description: "ID of the property to update",
    },
    property_name: {
      type: "string",
      required: false,
    },
    property_price: {
      type: "number",
      required: false,
    },
    property_address: {
      type: "string",
      required: false,
    },
    property_baths: {
      type: "number",
      required: false,
    },
    property_beds: {
      type: "number",
      required: false,
    },
    property_area: {
      type: "number",
      required: false,
    },
    property_owner: {
      type: "string",
      required: false,
    },
    property_image: {
      type: "ref",
      required: false,
    },
    property_description: {
      type: "string",
      required: false,
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
  },

  fn: async function (inputs, exits) {
    let transaction;
    try {
      // Start a transaction
      transaction = await Property.sequelize.transaction();

      // Find the property by ID
      let property = await Property.findOne({
        where: {
          property_id: inputs.id,
        },
      });

      // If the property doesn't exist, return an error
      if (!property) {
        await transaction.rollback();
        return exits.notFound({
          message: "Property not found",
        });
      }

      // Update only the fields that are provided
      if (inputs.property_name) property.property_name = inputs.property_name;
      if (inputs.property_price) property.property_price = inputs.property_price;
      if (inputs.property_address) property.property_address = inputs.property_address;
      if (inputs.property_baths) property.property_baths = inputs.property_baths;
      if (inputs.property_beds) property.property_beds = inputs.property_beds;
      if (inputs.property_area) property.property_area = inputs.property_area;
      if (inputs.property_owner) property.property_owner = inputs.property_owner;
      if (inputs.property_description) property.property_description = inputs.property_description;

      // Handle the property_image field (either URL or Base64)
      if (inputs.property_image) {
        // If it's an array, handle each image separately
        if (Array.isArray(inputs.property_image)) {
          const imageUrls = await Promise.all(inputs.property_image.map(async (image, index) => {
        if (image.startsWith('data:image')) {
          // Convert base64 image to URL
          const base64Data = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
          return await uploadtos3(base64Data, `${Date.now()}-${inputs.property_name}-${index}.jpg`, 'image/jpeg');
        } else {
          // Keep URL as is
          return image;
        }
          }));

          // Save the image URLs as a comma-separated string
          property.property_image = imageUrls.join(','); // Join the URLs with commas
        } else {
          // If it's a single image (not an array), check if it's Base64 or URL
          if (inputs.property_image.startsWith('data:image')) {
        // Convert base64 image to URL
        const base64Data = Buffer.from(inputs.property_image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        property.property_image = await uploadtos3(base64Data, `${Date.now()}-${inputs.property_name}-0.jpg`, 'image/jpeg');
          } else {
        // If it's already a URL, store it as a single string
        property.property_image = inputs.property_image;
          }
        }
      }

      // Save changes within the transaction
      await property.save({ transaction });
      await transaction.commit();

      // Respond with a success message
      return exits.success({
        message: "Property updated successfully",
        data: property,
      });
    } catch (error) {
      // Rollback if there's an error
      console.log(error);

      if (transaction) await transaction.rollback();
      return exits.exception({
        message: "An error occurred while updating the property",
        error: error.message,
      });
    }
  },
};


