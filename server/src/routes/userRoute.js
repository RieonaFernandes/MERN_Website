const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const {
  userRegValidator,
  sanitizeRegMiddleware,
  userLoginValidator,
} = require("../middlewares/validator");

router.post(
  "/user/register",
  sanitizeRegMiddleware,
  userRegValidator,
  userService.registerUser
);

router.post(
  "/user/login",
  sanitizeRegMiddleware,
  userLoginValidator,
  userService.loginUser
);

module.exports = router;
