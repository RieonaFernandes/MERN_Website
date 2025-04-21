const { BAD_REQUEST, SERVER_ERROR } = require("../config/errors");
const {
  sanitizeRegInput,
  sanitizeUserReqInput,
} = require("../middlewares/sanitizeInput");
const { MESSAGE } = require("../config/constants");

async function userRegValidator(req, res, next) {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      role,
      phone,
      countryCode,
    } = req.body;

    if (
      !firstName ||
      typeof firstName !== "string" ||
      /[^a-zA-Z]/.test(firstName)
    ) {
      return next(
        BAD_REQUEST("Validation error: Invalid or missing first name")
      );
    }

    if (
      !lastName ||
      typeof lastName !== "string" ||
      /[^a-zA-Z]/.test(lastName)
    ) {
      return next(
        BAD_REQUEST("Validation error: Invalid or missing last name")
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return next(BAD_REQUEST("Validation error: Invalid or missing email"));
    }

    if (
      !password ||
      typeof password !== "string" ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)
    ) {
      return next(
        BAD_REQUEST(
          "Validation error: Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character"
        )
      );
    }

    if (
      middleName &&
      (typeof middleName !== "string" || /[^a-zA-Z]/.test(middleName))
    ) {
      return next(BAD_REQUEST("Validation error: Invalid middle name"));
    }

    if (role && !["user", "admin"].includes(role)) {
      return next(BAD_REQUEST("Validation error: Role must be user or admin"));
    }

    if (phone && (typeof phone !== "string" || !/^[\d+\- ]+$/.test(phone))) {
      return next(BAD_REQUEST("Validation error: Invalid phone number format"));
    }

    if (phone && (!countryCode || !/^\+\d{1,4}$/.test(countryCode))) {
      return next(
        BAD_REQUEST("Validation error: Invalid country code (e.g., +44)")
      );
    }

    next();
  } catch (err) {
    return next(SERVER_ERROR(MESSAGE.VALIDATION_ERROR));
  }
}

async function userLoginValidator(req, res, next) {
  try {
    const { email, password, deviceId, deviceType } = req.body;

    if (
      deviceId &&
      (typeof deviceId !== "string" || /[^a-zA-Z0-9]/.test(deviceId))
    ) {
      return next(BAD_REQUEST(MESSAGE.LOGIN_FAILED));
    }

    if (
      deviceType &&
      (typeof deviceType !== "string" || /[^a-zA-Z0-9]/.test(deviceType))
    ) {
      return next(BAD_REQUEST(MESSAGE.LOGIN_FAILED));
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return next(BAD_REQUEST(MESSAGE.LOGIN_FAILED));
    }

    if (
      !password ||
      typeof password !== "string" ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)
    ) {
      return next(BAD_REQUEST(MESSAGE.LOGIN_FAILED));
    }

    next();
  } catch (err) {
    return next(SERVER_ERROR(MESSAGE.LOGIN_FAILED));
  }
}

async function userProfileValidator(req, res, next) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string" || /[^a-zA-Z0-9]/.test(id)) {
      return next(BAD_REQUEST(MESSAGE.LOGIN_FAILED));
    }

    next();
  } catch (err) {
    return next(SERVER_ERROR(MESSAGE.LOGIN_FAILED));
  }
}

function sanitizeRegMiddleware(req, res, next) {
  try {
    req.body = sanitizeRegInput(req.body);
    next();
  } catch (err) {
    return next(SERVER_ERROR(MESSAGE.LOGIN_FAILED));
  }
}

function sanitizeUserReqMiddleware(req, res, next) {
  try {
    req.params = sanitizeUserReqInput(req.params);
    next();
  } catch (err) {
    return next(SERVER_ERROR(MESSAGE.LOGIN_FAILED));
  }
}

module.exports = {
  userRegValidator,
  sanitizeRegMiddleware,
  userLoginValidator,
  sanitizeUserReqMiddleware,
  userProfileValidator,
};
