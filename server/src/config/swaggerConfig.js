const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const root = require("path").normalize(__dirname + "/..");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FloQi API",
      description: "API documentation for the FloQi",
      version: "1.0.0",
    },
    servers: [
      {
        url: `${process.env.HOST}:${process.env.PORT}`,
        description: `${process.env.ENV} server`,
      },
    ],
  },
  apis: [root + "/routes/userRoute.js"],
};

const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app, port) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
module.exports = swaggerDocs;
