const Users = require("../models/usersSchema");
const Tokens = require("../models/userTokens");
const {
  CONFLICT,
  SERVER_ERROR,
  BAD_REQUEST,
  NOT_AUTHORIZED,
} = require("../config/errors");
const { MESSAGE } = require("../config/constants");
const {
  hash,
  compareHash,
  generateToken,
  encrypt,
} = require("../config/utils");
const moment = require("moment");
require("dotenv").config();

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
    const { email, password, deviceId, deviceType } = req.body;
    const user = await Users.findOne({ email });

    if (!user) return callback(NOT_AUTHORIZED(MESSAGE.LOGIN_FAILED), null);

    const isMatch = await compareHash(password, user.password);

    if (!isMatch) {
      return callback(NOT_AUTHORIZED(MESSAGE.LOGIN_FAILED), null);
    }
    let accessToken = encrypt(
      generateToken(
        { userId: user._id, firstName: user.firstName },
        process.env.JWT_SECRET_KEY,
        process.env.JWT_TOKEN_EXPIRY
      )
    );
    let refreshToken = encrypt(
      generateToken(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        process.env.REFRESH_TOKEN_EXPIRY
      )
    );
    let accessTokenExpTime = moment(new Date())
      .add(process.env.JWT_TOKEN_EXPIRY[0], process.env.JWT_TOKEN_EXPIRY[1])
      .toDate();

    let refreshTokenExpTime = moment(new Date())
      .add(
        process.env.REFRESH_TOKEN_EXPIRY[0],
        process.env.REFRESH_TOKEN_EXPIRY[1]
      )
      .toDate();

    let userId = encrypt(user._id.toString());

    let res = await Users.findOneAndUpdate(
      { email },
      {
        $set: {
          lastLogin: new Date(),
          isActive: true,
          accessToken: accessToken,
          accessTokenExpTime: accessTokenExpTime,
          refreshToken: refreshToken,
          refreshTokenExpTime: refreshTokenExpTime,
        },
      },
      { new: true }
    );

    if (res.isActive === true) {
      await Tokens.create({
        userId: user._id,
        deviceId: deviceId,
        deviceType: deviceType,
        accessToken: accessToken,
        accessTokenExpTime: accessTokenExpTime,
        refreshToken: refreshToken,
        refreshTokenExpTime: refreshTokenExpTime,
      });
      return callback(null, {
        message: MESSAGE.LOGIN_SUCCESS,
        data: {
          userId,
          email,
          accessToken,
          accessTokenExpTime,
          refreshToken,
          refreshTokenExpTime,
        },
      });
    } else return callback(BAD_REQUEST(MESSAGE.LOGIN_FAILED), null);
  } catch (error) {
    return callback(SERVER_ERROR(MESSAGE.LOGIN_FAILED), null);
  }
}

async function getUser(req, callback) {
  try {
    let userData = await Users.findOne(
      { _id: req.params.id },
      { firstName: 1, lastName: 1, email: 1, phone: 1, countryCode: 1 }
    );
    if (userData) {
      return callback(null, {
        message: MESSAGE.SUCCESS,
        data: userData,
      });
    } else return callback(BAD_REQUEST(MESSAGE.DATA_NOT_FOUND), null);
  } catch (error) {
    return callback(SERVER_ERROR(MESSAGE.LOGIN_FAILED), null);
  }
}
module.exports = { registerUser, loginUser, getUser };
