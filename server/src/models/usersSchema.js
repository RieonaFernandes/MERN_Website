const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { COLLECTIONS } = require("../config/constants");

const usersSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    phone: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    accessToken: {
      type: String,
    },
    accessTokenExpTime: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    refreshTokenExpTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(COLLECTIONS.Users, usersSchema);
