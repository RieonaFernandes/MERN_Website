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

//User registration API
/**
 * @openapi
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the given credentials and personal information.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phone
 *               - countryCode
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name.
 *                 example: Kennith
 *               middleName:
 *                 type: string
 *                 description: The user's middle name.
 *                 example: Helen
 *               lastName:
 *                 type: string
 *                 description: The user's last name. This field should be encrypted before sending.
 *                 example: 0bbc993a5b4b5bafbfb6c9d90272928d
 *               email:
 *                 type: string
 *                 description: The user's email address. This field should be encrypted before sending.
 *                 example: 57159f10b411bc7f265e8b5b522e670f
 *               password:
 *                 type: string
 *                 description: The user's password. This field should be encrypted before sending.
 *                 example: d4b73b40778d193d07a8a853eaee9f6d
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *                 example: "675890"
 *               countryCode:
 *                 type: string
 *                 description: The user's country code for the phone number. This is only required if the phone number field is present.
 *                 example: "+90"
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 details:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: User created successfully.
 *                     data:
 *                       type: object
 *                       example: {}
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-19T23:27:26.037Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 details:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Validation error; Invalid or missing last name
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 409
 *                 details:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: User already exists!
 */
router.post(
  "/user/register",
  sanitizeRegMiddleware,
  userRegValidator,
  userService.registerUser
);

//User login API
/**
 * @openapi
 * /api/v1/user/login:
 *   post:
 *     summary: User login
 *     description: Logs the user in with their encrypted credentials (email and password) and returns an encrypted userId, access token, and refresh token.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address. This field is encrypted before sending.
 *                 example: "57159f10b411bc7f265e8b5b522e670f"
 *               password:
 *                 type: string
 *                 description: The user's password. This field is encrypted before sending.
 *                 example: "d4b73b40778d193d07a8a853eaee9f6d"
 *     responses:
 *       200:
 *         description: User logged in successfully with encrypted tokens and userId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 details:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "User Logged in successfully."
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: The encrypted user ID.
 *                           example: "8aab4bbf6a31dcd2c4d604d615ea4e8b9100d4b73fb6c8e454c439b13adcafc4"
 *                         accessToken:
 *                           type: string
 *                           description: The encrypted access token used for authenticating future requests.
 *                           example: "065d5b4bb2abcd2d302adc29e348a1ef5230d57b7e07113e33e13b85231bfd468d3f7a1979b1bef1f37862cdd265146dbcc76dc5c0d41c715f6418225ef5d0a4024e8df914c605fc988a0a7e9584c48666fdae2655b1e037d942b332ab4f1d355912f13828db907a8cb4b0e23f698263907ff2c6d33b18bd7857b045250ca13b8c82d6e761e10d06db45654380e66d1f19f31517553f07ab293e040df2071dadfdcb859b4d7f7abae7863648b74449521453e2db681a20b1c119d6528cdb6ce20ba4343327af41321eed349c6d2a6b54"
 *                         accessTokenExpTime:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-04-21T19:27:38.396Z"
 *                         refreshToken:
 *                           type: string
 *                           description: The encrypted refresh token used to obtain a new access token.
 *                           example: "065d5b4bb2abcd2d302adc29e348a1ef5230d57b7e07113e33e13b85231bfd468d3f7a1979b1bef1f37862cdd265146dbcc76dc5c0d41c715f6418225ef5d0a4024e8df914c605fc988a0a7e9584c4864047a6ebdb74948ddac8900333864dd62e0d947596447818f47a1170631447b251e4921570df295c9a9c8a0f9a13b991847b55ada5b4b6356e4d36f6465b9114f12b09667347643520eae5691c1dd9003a0cfcf1065f56a73edf4f8beb7f0fefc2081c65ecc1b5c649e6e841d77847d5"
 *                         refreshTokenExpTime:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-04-24T18:27:38.397Z"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-21T18:27:38.420Z"
 *       400:
 *         description: Authentication / Submission failed due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 details:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Authentication / Submission has failed."
 */

router.post(
  "/user/login",
  sanitizeRegMiddleware,
  userLoginValidator,
  userService.loginUser
);

//Get user profile
/**
 * @openapi
 * /api/v1/user/{id}:
 *   get:
 *     summary: Get user profile
 *     description: Fetches the user profile details based on the provided id. Requires a valid Bearer token for authorization. All sensitive fields, including the token, are encrypted.
 *     tags:
 *       - User
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The unique ID of the user whose profile is being fetched. The `userId` is encrypted.
 *         schema:
 *           type: string
 *           example: "8aab4bbf6a31dcd2c4d604d615ea4e8b9100d4b73fb6c8e454c439b13adcafc4"
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: The JWT token used to authenticate the request. This token must be included in the `Authorization` header as `Bearer <JWT>`. The token is encrypted for security purposes.
 *         schema:
 *           type: string
 *           example: "Bearer 065d5b4bb2abcd2d302adc29e348a1ef5230d57b7e07113e33e13b85231bfd468d3f7a1979b1bef1f37862cdd265146dbcc76dc5c0d41c715f6418225ef5d0a4024e8df914c605fc988a0a7e9584c48666fdae2655b1e037d942b332ab4f1d355912f13828db907a8cb4b0e23f698263907ff2c6d33b18bd7857b045250ca13b8c82d6e761e10d06db45654380e66d1f19f31517553f07ab293e040df2071dadfdcb859b4d7f7abae7863648b74449521453e2db681a20b1c119d6528cdb6ce20ba4343327af41321eed349c6d2a6b54"
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Successfully retrieved the user profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 details:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Success"
 *                     data:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The unique user ID.
 *                           example: "6804315ed6494b42904880a4"
 *                         firstName:
 *                           type: string
 *                           description: The user's first name.
 *                           example: "Kennith"
 *                         lastName:
 *                           type: string
 *                           description: The user's last name. This field is encrypted before being transmitted.
 *                           example: "0bbc993a5b4b5bafbfb6c9d90272928d"
 *                         email:
 *                           type: string
 *                           description: The user's email address. This field is encrypted before being transmitted.
 *                           example: "57159f10b411bc7f265e8b5b522e670f"
 *                         phone:
 *                           type: string
 *                           description: The user's phone number. This field is encrypted before being transmitted.
 *                           example: "f6af27d73085866c4dc7a9698d3c2309"
 *                         countryCode:
 *                           type: string
 *                           description: The user's country code for the phone number.
 *                           example: "+90"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-21T14:36:22.563Z"
 *       400:
 *         description: Invalid request, missing or incorrect authorization token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 details:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Authentication / Submission has failed."
 *       500:
 *         description: Server error while fetching the user profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 details:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Authentication / Submission has failed."
 */

router.get(
  "/user/:id",
  sanitizeUserReqMiddleware,
  userProfileValidator,
  authenticateAccessToken,
  userService.getUser
);

module.exports = router;
