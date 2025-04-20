const Users = require("../models/usersSchema");
const {
  CONFLICT,
  SERVER_ERROR,
  BAD_REQUEST,
  NOT_AUTHERIZED,
} = require("../config/errors");
const { MESSAGE } = require("../config/constants");
const { hash, compareHash } = require("../config/utils");

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
    else return callback(BAD_REQUEST(MESSAGE.USER_REG_FAILED), null);
  } catch (error) {
    return callback(SERVER_ERROR(MESSAGE.USER_REG_FAILED), null);
  }
}

async function loginUser(req, callback) {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) return callback(NOT_AUTHERIZED(MESSAGE.LOGIN_FAILED), null);

    const isMatch = await compareHash(password, user.password);

    if (!isMatch) return callback(NOT_AUTHERIZED(MESSAGE.LOGIN_FAILED), null);

    let res = await Users.findOneAndUpdate(
      { email },
      {
        $set: {
          lastLogin: new Date(),
          isActive: true,
        },
      },
      { new: true }
    );

    if (res.isActive === true)
      return callback(null, {
        message: MESSAGE.LOGIN_SUCCESS,
        data: { email },
      });
    else return callback(BAD_REQUEST(MESSAGE.LOGIN_FAILED), null);
  } catch (error) {
    console.log(error);
    return callback(SERVER_ERROR(MESSAGE.LOGIN_FAILED), null);
  }
}

module.exports = { registerUser, loginUser };
