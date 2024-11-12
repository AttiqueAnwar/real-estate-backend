module.exports.http = {
  middleware: {
    bodyParser: (function _configureBodyParser(){
      var skipper = require('skipper');
      // Set a higher limit (e.g., 20MB) for multipart data (images, files, etc.)
      var middlewareFn = skipper({
        strict: true,
        limit: '20mb'  // Increase limit to 20MB
      });
      return middlewareFn;
    })(),
  },
};
