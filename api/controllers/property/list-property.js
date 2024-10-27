// controller for listing all property with pagination and search and get single property by ide

module.exports = {
  friendlyName: "List property",
  description: "",
  inputs: {
    id: {
      type: "number",
    },
    start: {
      type: "number",
      defaultsTo: 0,
    },
    limit: {
      type: "number",
      defaultsTo: 10,
    },
    draw: {
      type: "number",
      defaultsTo: 0,
    },
    search: {
      type: "ref",
      defaultsTo: "",
    },
    orderBy: {
      type: "string",
    },
    orderDir: {
      type: "string",
    },
    property_name: {
      type: "string",
    },
  },

  exits: {
    exception: {
      //responseType: 'exception'
    },
    success: {
      //responseType: 'success'
    },
    notFound: {
      responseType: "notFound",
    },
    conflict: {
      responseType: "conflict",
    },
  },

  fn: async function (inputs, exits) {
    let opts = {},
      result = {};
    try {
      let { req } = this;
      let _defaults = {
        orderBy: "property_id",
        orderDir: "desc",
        limit: 10,
        start: 0,
      };
      let options = _.omitBy(
        {
          orderBy:
            inputs.orderBy ||
            (req.body
              ? req.body[`columns[${req.body["order[0][column]"]}][data]`]
              : undefined),
          orderDir:
            inputs.orderDir ||
            (req.body ? req.body["order[0][dir]"] : undefined),
          search:
            inputs.search || (req.body ? req.body["search[value]"] : undefined),
        },
        _.isNil
      );

      opts = _.merge({}, _defaults, inputs, options);
      opts.start = !isNaN(opts.start) ? +opts.start : _defaults.start;
      opts.limit = !isNaN(opts.limit) ? +opts.limit : _defaults.limit;
      // opts.search = opts.search.trim();
      opts.skip = opts.start; // * opts.limit

      const query = {

        skip: opts.skip,
        order: [[opts.orderBy, opts.orderDir]],
        ...(opts.limit > -1 ? {limit: opts.limit} : {}),
      };

      if (inputs.id) {
        let row = await Property.findOne({ where: { property_id: inputs.id } });
        if (!row) {
          return exits.notFound({
            message: "Property not found.",
          });
        }
        row = row.toJSON();
        return exits.success(row);
      }

      let { rows, count } = await Property.findAndCountAll(query);

      rows = rows.map((row) => row.toJSON());

      result = {
        draw: opts.draw,
        recordsTotal: count,
        recordsFiltered: count,
        data: rows,
      };
      return exits.success(result);
    } catch (err) {
      console.log({ err });
      result = {
        draw: opts.draw,
        recordsTotal: 0,
        recordsFiltered: 0,
        data: [],
      };
      return exits.success(result);
    }
  },
};
