const validator = require("validator");

function sanitizeRegInput(data) {
  const sanitized = {};

  if (data.firstName)
    sanitized.firstName = validator.escape(data.firstName.trim());
  if (data.middleName)
    sanitized.middleName = validator.escape(data.middleName.trim());
  if (data.lastName)
    sanitized.lastName = validator.escape(data.lastName.trim());

  if (data.email) sanitized.email = validator.normalizeEmail(data.email.trim());
  if (data.password) sanitized.password = data.password.trim(); // Don't escape passwords

  if (data.role) sanitized.role = validator.escape(data.role.trim());
  if (data.phone) sanitized.phone = data.phone.replace(/[^\d+\- ]/g, "");
  if (data.countryCode) sanitized.countryCode = data.countryCode.trim();

  return sanitized;
}

module.exports = { sanitizeRegInput };
