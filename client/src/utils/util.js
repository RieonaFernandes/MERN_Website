import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

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

export function isTokenValid() {
  const token = Cookies.get("accessToken");

  if (!token) return false;
  try {
    const decodedToken = jwtDecode(decrypt(token));
    const currentTime = Date.now() / 1000;

    // Check if token will expire in next 5 minutes
    const bufferTime = 300; // 5 minutes in seconds

    return decodedToken.exp > currentTime + bufferTime;
  } catch (error) {
    console.error("Token validation failed:", error);
    Cookies.remove("accessToken");
    Cookies.remove("userId");
    return false;
  }
}
