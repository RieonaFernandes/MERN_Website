const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { COLLECTIONS } = require("../config/constants");

const userTokenSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    deviceId: {
      type: String,
    },
    deviceType: {
      type: String,
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

module.exports = mongoose.model(COLLECTIONS.Tokens, userTokenSchema);
