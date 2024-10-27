module.exports = {
  friendlyName: "Delete property",
  description: "",
  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },
  exits: {
    exception: {
      responseType: "exception",
      statusCode: 500,  // Adding status code for exception
    },
    success: {
      responseType: "success",
      statusCode: 200,  // Adding status code for success
    },
    notFound: {
      responseType: "notFound",
      statusCode: 404,  // Adding status code for notFound
    },
  },
  fn: async function (inputs, exits) {
    console.log(inputs);

    let { id } = inputs;
    let transaction;

    try {
      transaction = await Property.sequelize.transaction();
      let property = await Property.findOne({
        where: {
          property_id: id,
        },
        transaction,
        lock: transaction.LOCK,
      });
      
      if (!property) {
        return exits.notFound({
          message: "Property not found",
        });
      }
      
      await Property.destroy({
        where: {
          property_id: id,
        },
        transaction,
        lock: transaction.LOCK,
      });
      
      await transaction.commit();
      return exits.success({
        message: "Property deleted successfully",
      });
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return exits.exception({
        message: err.message,
      });
    }
  },
};
