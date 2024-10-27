module.exports.datastores = {
  default: {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    dialect: 'mysql',
    options: {
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      logging: /* process.env.NODE_ENV === "production"  ?*/ false /* : console.log*/,
      // operatorsAliases: false,
      //timezone: '+05:00', //for reading from database
      dateStrings: true,
      dialectOptions: {
        typeCast: function (field, next) { // for reading from database
          if (field.type === 'DATETIME' || field.type === 'DATE') {
            return field.string()
          }
          return next()
        }
      },
    },
  },

};
