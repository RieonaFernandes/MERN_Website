const Users = require("../models/usersSchema");
const { CONFLICT, SERVER_ERROR, BAD_REQUEST } = require("../config/errors");
const { MESSAGE } = require("../config/constants");
const { hash } = require("../config/utils");

async function registerUser(req, callback) {
  try {
    query = {};
    query.email = req.email;
    let userData = await Users.find(query);

    if (userData.length > 0) {
      return callback(CONFLICT(MESSAGE.USER_EXISTS), null);
    }
    query = req;
    query.password = await hash(req.password);
    let res = await Users.create(query);
    if (res.email === req.email)
      return callback(null, {
        message: MESSAGE.USER_CREATED,
        data: {},
      });
    else
      return callback(
        BAD_REQUEST("User registration failed. Please try again."),
        null
      );
  } catch (error) {
    return callback(
      SERVER_ERROR("User registration failed. Please try again."),
      null
    );
  }
}

module.exports = { registerUser };
