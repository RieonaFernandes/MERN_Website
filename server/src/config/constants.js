let COLLECTIONS = {
  Users: process.env.ENV + "_collection_" + "users",
  Tokens: process.env.ENV + "_collection_" + "tokens",
};

let STATUS_TYPES = {
  HTTP_ERR: 400, //  bad request to the server
  CONFLICT: 409, //if data already exists
  SUCCESS: 200, //get result success
  INVALID: 400, //invalid data
  HTTP_POST_S: 201, //post request succcess
  DB_ERR: 500, //Error in database
  NOT_FOUND: 404, //if data is not present
  NOT_AUTHERIZED: 401, //user is not authorised to access the api
  FORBIDDEN: 403, //forbidden
  NO_RECORDS: 404, //no records found
  BAD_REQUEST: 400, //bad request
  BAD_PARAMS: 400, //invalid  params
  PARAM_MISSING: 400, // required params are missing
};

let MESSAGE = {
  SUCCESS: "Success",
  USER_EXISTS: "User already exists!",
  USER_CREATED: "User created successfully.",
  USER_REG_FAILED: "User registration failed. Please try again.",
  LOGIN_FAILED: "Authentication / Submission has failed.",
  LOGIN_SUCCESS: "User Logged in successfully.",
  VALIDATION_ERROR: "Authentication Failed",
};

module.exports = { COLLECTIONS, STATUS_TYPES, MESSAGE };
