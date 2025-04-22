const { logger } = require("./logger");
const morgan = require("morgan");

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

module.exports = { morganMiddleware };
