/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {
  //Add moment library
  moment = require("moment");

  sails.shortid = require("shortid");

  String.prototype.removeQoutes = function () {
    return this.replace(/["']/g, "");
  };
  String.prototype.keepDigitsAndComma = function () {
    return this.replace(/[^0-9,]/g, "");
  };
  String.prototype.keepDigitsCommaDashAndDot = function () {
    return this.replace(/[^0-9,.-]/g, "");
  };
  String.prototype.keepAlphabets = function () {
    return this.replace(/[^a-zA-Z]/g, "");
  };
  String.prototype.trailFormatter = function (splitter = ",") {
    return this.slice(1, -1).split(splitter);
  };

  String.prototype.replacePlusWithSpace = function () {
    return this.replace(/[+]/g, ' ');
  };

  String.prototype.addressFormatter = function () {
    return decodeURIComponent(this).replacePlusWithSpace();
  };

  Number.prototype.thousandSeparator = function () {
    var parts = (this + "").split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  Number.prototype.secondsToTimeFormat = function (sec = false) {
    var x = this;
    var d = moment.duration(x, 'seconds');
    var hours = Math.floor(d.asHours());
    var mins = Math.floor(d.asMinutes()) - hours * 60;
    var seconds = Math.floor(d.asSeconds()) - Math.floor(d.asMinutes()) * 60;
    if (sec)
      return hours + ":" + mins + ":" + seconds
    else
      return hours + mins
  };

  Array.prototype.setTrail = function (splitter = ",") {
    return splitter + _.without(this, "").toString() + splitter;
  };

  treeify = function(list, idAttr, parentAttr, childrenAttr) {
    if (!idAttr) idAttr = 'id';
    if (!parentAttr) parentAttr = 'parent';
    if (!childrenAttr) childrenAttr = 'children';

    var treeList = [];
    var lookup = {};
    list.forEach(function (obj) {
        lookup[obj[idAttr]] = obj;
        obj[childrenAttr] = [];
    });
    list.forEach(function (obj) {
        if (lookup[obj[parentAttr]] && obj[parentAttr] != null) {
            lookup[obj[parentAttr]][childrenAttr].push(obj);
        } else {
            treeList.push(obj);
        }
    });
    return treeList;
  };

  setTrail = function (value, splitter = ",") {
    if (!value) return null;

    var isJSON = true;

    try {
      value = Array.isArray(value) ? value : JSON.parse(value);
    } catch (ex) {
      isJSON = false;
    }

    if (typeof value === "number" || typeof value === "string") value = [value];

    return value.setTrail(splitter);
  };

  toXFixed = function (value, offset = 2) {
    var result = parseFloat(value).toFixed(offset);
    return result == "NaN" ? 0 : parseFloat(result);
  };
  sendCustomResponce = function (status, message) {
    return JSON.parse(JSON.stringify({
      status: status,
      message: sails.__(message)
    }));
  };
  stringifyResponce = function (status, message) {
    return JSON.stringify({
      status: status,
      message: sails.__(message)
    });
  };
  parseResponce = function (obj) {
    return JSON.parse(obj);
  };

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();
};
