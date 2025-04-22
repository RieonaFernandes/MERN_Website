const express = require("express");
require("dotenv").config();
const mongoDbConnection = require("./config/mongoDbConnection");
const routes = require("./routes/userRoute");
const errors = require("./middlewares/errorHandler");
// const requestLogger = require("./middlewares/requestLogger");
const cors = require("cors");
const swaggerDocs = require("./config/swaggerConfig");
const { morganMiddleware } = require("./middlewares/morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();
const corsOptions = {
  origin: process.env.URLs.split(","), // restrict access
  methods: ["GET", "POST", "OPTIONS"], // allow requests
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.ENV === "test" ? 1000 : 500, // limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again later.", // error message
  standardHeaders: true, // Send RateLimit headers
  legacyHeaders: false, // Disable X-RateLimit headers
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-scripts.example.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "cdn.example.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
  })
);

// app.use(requestLogger);
app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(morganMiddleware);
app.use("/api/v1/", limiter);

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (
    process.env.ENV === "prod" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  next();
});
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
