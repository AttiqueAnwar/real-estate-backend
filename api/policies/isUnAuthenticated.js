module.exports = async function (req, res, next) {
  this.req = req;
  this.res = res;
  next();
};
