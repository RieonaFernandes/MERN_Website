const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { SERVER_ERROR, NOT_AUTHORIZED, FORBIDDEN } = require("../config/errors");
const { MESSAGE } = require("../config/constants");

const secretKey = CryptoJS.enc.Hex.parse(process.env.AES_SECRET_KEY);
const iv = CryptoJS.enc.Hex.parse(process.env.AES_IV);

async function hash(str) {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(str, saltRounds);
    return hashedPassword;
  } catch (err) {
    throw SERVER_ERROR(MESSAGE.USER_REG_FAILED);
  }
}

function encrypt(plainText) {
  try {
    const encrypted = CryptoJS.AES.encrypt(plainText, secretKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const encStr = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    return encStr;
  } catch (err) {
    throw SERVER_ERROR(MESSAGE.LOGIN_FAILED);
  }
}

function decrypt(encText) {
  try {
    const ciphertext = CryptoJS.enc.Hex.parse(encText);
    const decipher = CryptoJS.AES.decrypt({ ciphertext }, secretKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let decrypted = decipher.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (err) {
    throw SERVER_ERROR(MESSAGE.LOGIN_FAILED);
  }
}

function compareHash(str, hash) {
  try {
    return bcrypt.compare(str, hash);
  } catch (err) {
    throw SERVER_ERROR(MESSAGE.LOGIN_FAILED);
  }
}

function generateToken(userData, key, expiresIn) {
  try {
    return jwt.sign(userData, key, {
      expiresIn: expiresIn,
    });
  } catch (err) {
    throw SERVER_ERROR(MESSAGE.LOGIN_FAILED);
  }
}

function authenticateAccessToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    token = decrypt(token);

    if (!token) throw NOT_AUTHORIZED(MESSAGE.LOGIN_FAILED);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userData) => {
      if (err) throw FORBIDDEN(MESSAGE.LOGIN_FAILED);
      if (req.params.id !== userData.userId) {
        throw FORBIDDEN(MESSAGE.LOGIN_FAILED);
      }
      next();
    });
  } catch (err) {
    throw SERVER_ERROR(MESSAGE.LOGIN_FAILED);
  }
}

module.exports = {
  hash,
  encrypt,
  decrypt,
  compareHash,
  generateToken,
  authenticateAccessToken,
};
