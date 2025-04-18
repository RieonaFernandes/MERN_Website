const express = require("express");
require("dotenv").config();
const mongoDbConnection = require("./config/mongoDbConnection");
const routes = require("./routes/userRoute");
const bodyParser = require("body-parser");
const errors = require("./middlewares/errorHandler");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
