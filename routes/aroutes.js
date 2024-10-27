module.exports = {
  "POST /api/v1/en/user/login": "user/login",
  "POST /api/v1/en/user/register": "user/register",
  "GET /api/v1/en/user/forgot/:user_email/password": "user/forgot-password",
  "POST /api/v1/en/user/renew/password/:check_code": "user/renew-password",
 
 

  // Property
  "POST /api/v1/en/property/add": "property/add-property",
  "POST /api/v1/en/property/edit/:id": "property/edit-property",
  "GET /api/v1/en/property/delete/:id": "property/delete-property",
  "POST /api/v1/en/property/list": "property/list-property",
  "POST /api/v1/en/property/list/:id": "property/list-property",

};
