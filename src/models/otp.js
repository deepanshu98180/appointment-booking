const mongoose = require("mongoose");
const { OTP_TYPES, OTP_STATUSES, OTP_CHANNELS } = require("../constants/otp");
const { ROLES } = require("../constants/role");

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(OTP_CHANNELS),
      default: OTP_CHANNELS.MOBILE,
      required: true,
    },
    countryCode: {
      type: String,
      // required: true,
    },
    phone: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    otp: {
      type: Number,
    },
    otpType: {
      type: String,
      enum: Object.values(OTP_TYPES),
      default: OTP_TYPES.LOGIN,
    },
    otpExpiry: {
      type: Date,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
    },
    status: {
      type: String,
      enum: Object.values(OTP_STATUSES),
      default: OTP_STATUSES.PENDING,
    },
  },
  {
    timestamps: true,
     versionKey: false
  }
);

module.exports = mongoose.model("OTP", schema);
