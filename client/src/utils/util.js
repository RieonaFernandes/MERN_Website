import CryptoJS from "crypto-js";

const secretKeyVal = import.meta.env.VITE_AES_SECRET_KEY;
const ivVal = import.meta.env.VITE_AES_IV;

const secretKey = CryptoJS.enc.Hex.parse(secretKeyVal);
const iv = CryptoJS.enc.Hex.parse(ivVal);

export function encrypt(plainText) {
  try {
    const encrypted = CryptoJS.AES.encrypt(plainText, secretKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  } catch (err) {
    throw new Error("Authentication failed");
  }
}

export function decrypt(encText) {
  try {
    const ciphertext = CryptoJS.enc.Hex.parse(encText);
    const decipher = CryptoJS.AES.decrypt({ ciphertext }, secretKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decipher.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    throw new Error("Authentication failed");
  }
}
