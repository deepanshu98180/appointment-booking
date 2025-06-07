// @ts-check
const OtpVerification = require("../models/otp");
const User = require("../models/user");
const Session = require("../models/session");
const { OTP_TYPES, OTP_STATUSES } = require("../constants/otp");
const { SESSION_STATUSES } = require("../constants/sessionStatus");
const { generateJWT } = require("../lib/jwt");
const { OTP, USER, SESSION, SUCCESS, ERROR } = require("../constants/message");
const { USER_STATUSES, } = require("../constants/userStatus");



exports.getUsers = async (role, status) => {
   const user = await User.find({ role, status });
   if (!user) {
      return {
         success: false,
         message: ERROR.NOT_FOUND,
      };
   }
   return {
      success: true,
      message: SUCCESS.FETCHED,
      user
   };
};
exports.getBaseDetails = async (userId) => {
   const user = await User.findOne({ _id: userId });
   if (!user) {
      return {
         success: false,
         message: USER.NOT_FOUND,
      };
   }

   return {
      success: true,
      message: SUCCESS.FETCHED,
      user
   };
};

exports.updateUserDetails = async (userId, data) => {

   const user = await User.findOneAndUpdate({ _id: userId }, data, { new: true });

   if (!user) {
      return {
         success: false,
         message: USER.NOT_FOUND,
      };
   }
   return {
      success: true,
      message: USER.UPDATED,
      user: user
   };
};




