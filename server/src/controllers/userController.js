const Users = require("../models/usersSchema");
const { CONFLICT, SERVER_ERROR } = require("../config/errors");
const { MESSAGE } = require("../config/constants");

async function registerUser(req, callback) {
  try {
    query = {};
    query.email = req.email;
    let userData = await Users.find(query);

    if (userData.length > 0) {
      return callback(CONFLICT(MESSAGE.USER_EXISTS), null);
    }
    await Users.create(req);

    return callback(null, {
      message: MESSAGE.USER_CREATED,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return callback(
      SERVER_ERROR("User registration failed. Please try again."),
      null
    );
  }
}

module.exports = { registerUser };
