const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
require("dotenv").config();

const secretKey = CryptoJS.enc.Hex.parse(process.env.AES_SECRET_KEY);
const iv = CryptoJS.enc.Hex.parse(process.env.AES_IV);

async function hash(str) {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(str, saltRounds);
    return hashedPassword;
  } catch (err) {
    throw err;
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
    throw err;
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
    throw err;
  }
}

function compareHash(str, hash) {
  try {
    return bcrypt.compare(str, hash);
  } catch (err) {
    throw err;
  }
}

module.exports = { hash, encrypt, decrypt, compareHash };
