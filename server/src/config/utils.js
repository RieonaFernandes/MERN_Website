const bcrypt = require("bcrypt");
require("dotenv").config();

async function hash(str) {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(str, saltRounds);
    return hashedPassword;
  } catch (err) {
    throw err;
  }
}

module.exports = { hash };
