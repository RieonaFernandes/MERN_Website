const express = require("express");
require("dotenv").config();
const mongoDbConnection = require("./config/mongoDbConnection");
const app = express();

const port = process.env.PORT || 8080;

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
