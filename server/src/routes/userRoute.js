const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const {
  userRegValidator,
  sanitizeMiddleware,
} = require("../middlewares/validator");

router.post(
  "/user/register",
  sanitizeMiddleware,
  userRegValidator,
  userService.registerUser
);

module.exports = router;
