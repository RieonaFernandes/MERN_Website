const express = require("express");
require("dotenv").config();
const mongoDbConnection = require("./config/mongoDbConnection");
const routes = require("./routes/userRoute");
const errors = require("./middlewares/errorHandler");
// const requestLogger = require("./middlewares/requestLogger");
const cors = require("cors");
const swaggerDocs = require("./config/swaggerConfig");
const { morganMiddleware } = require("./middlewares/morgan");

const app = express();
const corsOptions = {
  origin: process.env.URLs.split(","), // restrict access
  methods: ["GET", "POST", "OPTIONS"], // allow only GET requests
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// app.use(requestLogger);
app.use(morganMiddleware);
app.use(cors(corsOptions));

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/v1/", routes);

app.use(errors.errorHandler);

// Start server
const startServer = async () => {
  try {
    await mongoDbConnection();
    app.listen(port, () => {
      console.log(`Server is running on ${process.env.HOST}:${port}`);
    });
    swaggerDocs(app, port);
    console.log(`OpenAPI Docs available at ${process.env.HOST}:${port}/docs`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.ENV !== "test") {
  startServer();
}

module.exports = app;
