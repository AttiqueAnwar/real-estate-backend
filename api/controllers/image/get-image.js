/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  inputs: {
    key: {
      type: 'string',
      required: true
    }
  },

  description: 'It is a helper to get the image from s3 bucket',

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
    const AWS = require('aws-sdk');

    let res = this.res;

      AWS.config.update({
      accessKeyId: config.key,
      secretAccessKey: config.secret,
      region: config.region
    });
    
    var s3 = new AWS.S3();
    var s3Params = {
      Bucket: config.bucket,
      Key: 'uploads/' + inputs.key
    };
    s3.getObject(s3Params, function (err, response) {
      if (err === null) {
        const b64 = Buffer.from(response.Body).toString('base64');
        const src = `data:${response.ContentType};base64,${b64}`;
        res.send(src);
      } else {
        exits.exception(err);
      }
    });

  },
};