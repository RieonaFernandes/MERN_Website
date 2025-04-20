const { BAD_REQUEST } = require("../config/errors");
const { sanitizeRegInput } = require("../middlewares/sanitizeInput");

async function userRegValidator(req, res, next) {
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
    return next(BAD_REQUEST("Validation error: Invalid or missing first name"));
  }

  if (!lastName || typeof lastName !== "string" || /[^a-zA-Z]/.test(lastName)) {
    return next(BAD_REQUEST("Validation error: Invalid or missing last name"));
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
}

async function userLoginValidator(req, res, next) {
  const { email, password } = req.body;

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

  next();
}

function sanitizeRegMiddleware(req, res, next) {
  req.body = sanitizeRegInput(req.body);
  next();
}

module.exports = {
  userRegValidator,
  sanitizeRegMiddleware,
  userLoginValidator,
};
