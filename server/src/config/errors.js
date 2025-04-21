const { STATUS_TYPES } = require("./constants");

class AppError extends Error {
  constructor(type, message, additionalData = {}) {
    super(message);
    this.code = STATUS_TYPES[type] || 500; // Defaults to 500 if type is not found
    this.details = { message, ...additionalData };
  }
}

// Helper functions for throwing errors
const BAD_REQUEST = (message, additionalData) =>
  new AppError("BAD_REQUEST", message, additionalData);

const NOT_FOUND = (message, additionalData) =>
  new AppError("NOT_FOUND", message, additionalData);

const SERVER_ERROR = (message, additionalData) =>
  new AppError("SERVER_ERROR", message, additionalData);

const CONFLICT = (message, additionalData) =>
  new AppError("CONFLICT", message, additionalData);

const NOT_AUTHORIZED = (message, additionalData) =>
  new AppError("NOT_AUTHORIZED", message, additionalData);

const FORBIDDEN = (message, additionalData) =>
  new AppError("FORBIDDEN", message, additionalData);

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
  NOT_AUTHORIZED,
  FORBIDDEN,
};
