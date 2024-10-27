// controller for editing a property

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
      type: "string",
      required: false,
    },
    property_owner: {
      type: "string",
      required: false,
    },
    property_image: {
      type: "string",
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
      if (inputs.property_image) property.property_image = inputs.property_image;
      if (inputs.property_description) property.property_description = inputs.property_description;

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
      if (transaction) await transaction.rollback();
      return exits.exception({
        message: "An error occurred while updating the property",
        error: error.message,
      });
    }
  },
};
