const validator = require("validator");
const { decrypt } = require("../config/utils");
const { SERVER_ERROR } = require("../config/errors");
const { MESSAGE } = require("../config/constants");

function sanitizeRegInput(data) {
  const sanitized = {};
  try {
    if (data.firstName)
      sanitized.firstName = validator.escape(data.firstName.trim());
    if (data.middleName)
      sanitized.middleName = validator.escape(data.middleName.trim());
    if (data.lastName) {
      data.lastName = decrypt(data.lastName);
      sanitized.lastName = validator.escape(data.lastName.trim());
    }

    if (data.email) {
      data.email = decrypt(data.email);
      sanitized.email = validator.normalizeEmail(data.email.trim());
    }
    if (data.password) {
      data.password = decrypt(data.password);
      sanitized.password = data.password.trim(); // Don't escape passwords
    }

    if (data.role) sanitized.role = validator.escape(data.role.trim());
    if (data.phone)
      sanitized.phone = data.phone
        .replace(/^(\(?\+\d+\)?[-\s]*)/, "")
        ?.replace(/[^\d]/g, "");
    if (data.countryCode) sanitized.countryCode = data.countryCode.trim();

    return sanitized;
  } catch (err) {
    return next(SERVER_ERROR(MESSAGE.LOGIN_FAILED));
  }
}

module.exports = { sanitizeRegInput };
