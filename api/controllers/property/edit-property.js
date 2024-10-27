// controller for edit property

module.exports = {
  friendlyName: "Edit property",
  description: "",
  inputs: {
    id: {
      type: "number",
      required: true,
    },
    property_name: {
      type: "string",
      required: true,
    },
  },
  exits: {
    exception: {},
  },
  fn: async function (inputs, exits) {
    let transaction;
    try {
      transaction = await Property.sequelize.transaction();
      let property = await Property.findOne({
        where: {
          property_id: inputs.id,
        },
      });

      if (!property) {
        return exits.exception({
          message: "Property not found",
        });
      }
      property.property_name = inputs.property_name;

      await property.save({
        transaction,
      });

      await transaction.commit();

      return exits.success({
        message: "Property updated successfully",
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      return exits.exception({
        message: error.message,
      });
    }
  },
};
