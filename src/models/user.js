const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { USER_STATUSES } = require("../constants/userStatus");
const { GENDERS } = require("../constants/gender");
const { MARTIAL_STATUS } = require("../constants/martialStatus");
const { ROLES } = require("../constants/role");

const UserSchema = new mongoose.Schema(
   {
     
      fullName: {
         type: String,
         trim: true,
         // required: "Full Name can't be empty",
      },
      countryCode: {
         type: String,
      },
      phone: {
         type: String,
      },
      role: {
         type: String,
         enum: Object.values(ROLES),
      },
      status: {
         type: String,
         enum: Object.values(USER_STATUSES),
         default: USER_STATUSES.ACTIVE,
      },
   },
   { timestamps: true, versionKey: false }
);

UserSchema.index({ phone: 1 });


module.exports = mongoose.model("User", UserSchema);
