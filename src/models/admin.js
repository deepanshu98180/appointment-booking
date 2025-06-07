const mongoose = require("mongoose");
const { USER_STATUSES } = require("../constants/userStatus");
const { ROLES } = require("../constants/role");

const ADMIN_TYPES = {
  ADMIN: "ADMIN",
  SUBADMIN: "SUBADMIN",
};


const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.SUBADMIN,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUSES),
      default: USER_STATUSES.ACTIVE,
    },
    name: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false  }
);

module.exports = mongoose.model("Admin", adminSchema);
module.exports.ADMIN_TYPES = ADMIN_TYPES;
