/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  inputs: {
    aclFile: {
      type: 'string',
      default: 'private'
    }
  },

  description: 'It is a helper to upload the image to s3 bucket',

  exits: {
    exception: {
      responseType: 'exception'
    },
    notFound: {
      responseType: 'notFound'
    },
    success: {
      responseType: 'success'
    }
  },

  fn: function (inputs, exits) {
    const config = require('../../../config/aws.config');
    let req = this.req;
    let res = this.res;

    req.file('file').upload({
      adapter: require('skipper-better-s3'),
      key: config.key,
      secret: config.secret,
      bucket: `${config.bucket}/uploads`,
      region: config.region,
      s3params: { ACL: inputs.aclFile }
    }, function (err, filesUploaded) {
      if (err) return res.serverError(err);
      return exits.success({
        files: {
          ...filesUploaded[0],
          url: `https://${config.bucket}.s3.${config.region}.amazonaws.com/uploads/` + filesUploaded[0].fd
        }
      });
    });
  },
};