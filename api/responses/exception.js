module.exports = function exception(data) {
  if (typeof data === 'number') {
    let message = '';
    if (data === 500)
      message = sails.__("Something is wrong with the database. Please try later.");
    else if (data === 404)
      message = sails.__("The requested record was not found.");
    else if (data === 409)
      message = sails.__("Record Already Exist");

    return this.res.status(data).json(message);
  }else{
    return this.res.status(data.status).json(sails.__(data.message));
  }

};
