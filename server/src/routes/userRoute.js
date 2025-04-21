const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const {
  userRegValidator,
  sanitizeRegMiddleware,
  userLoginValidator,
  sanitizeUserReqMiddleware,
  userProfileValidator,
} = require("../middlewares/validator");
const { authenticateAccessToken } = require("../config/utils");

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

router.get(
  "/user/:id",
  sanitizeUserReqMiddleware,
  userProfileValidator,
  authenticateAccessToken,
  userService.getUser
);

module.exports = router;
