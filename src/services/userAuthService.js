// @ts-check
const OtpVerification = require("../models/otp");
const User = require("../models/user");
const Session = require("../models/session");
const { OTP_TYPES, OTP_STATUSES } = require("../constants/otp");
const { SESSION_STATUSES } = require("../constants/sessionStatus");
const { generateJWT } = require("../lib/jwt");
const { OTP, USER, SESSION } = require("../constants/message");
const { userInfo } = require("node:os");
const { USER_STATUSES } = require("../constants/userStatus");

exports.sendOtp = async (countryCode, phone, role) => {
   const otp = 1234;
   const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

   let userInfo = await User.findOne({ countryCode, phone, status: { $nin: USER_STATUSES.DELETED } }).select('_id status');

   if (userInfo?.status == USER_STATUSES.BLOCKED) {
      return {
         success: false,
         message: USER.BLOCKED,
      };
   }

   let otpType = OTP_TYPES.SIGNUP
   if (userInfo?.status == USER_STATUSES.ACTIVE) otpType = OTP_TYPES.LOGIN

   if (userInfo && otpType == OTP_TYPES.SIGNUP) {
      return {
         success: false,
         message: USER.PHONE_ALREADY_USED,
      };
   }

   let otpData = await OtpVerification.findOneAndUpdate(
      { countryCode, phone, otpType },
      {
         otp: otp,
         otpExpiry: expiry,
         status: OTP_STATUSES.PENDING,
         role,
         type: "MOBILE",
      },
      { upsert: true, new: true }
   );

   return {
      success: true,
      message: OTP.SENT_SUCCESS,
      otpType
   };
};

exports.verifyOtp = async ({ countryCode, phone, otp, otpType, fcmToken, role }) => {
   const record = await OtpVerification.findOne({
      countryCode,
      phone,
      otp: otp,
      otpType,
      role,
      status: OTP_STATUSES.PENDING,
      otpExpiry: { $gt: new Date() },
   });

   if (!record) {
      return {
         success: false,
         message: OTP.INVALID_OTP,
      };
   }

   record.status = OTP_STATUSES.VERIFIED;
   await record.save();

   let user = await User.findOne({ countryCode, phone, status: { $ne: USER_STATUSES.DELETED } });

   if (user?.status == USER_STATUSES.BLOCKED) {
      return {
         success: false,
         message: USER.BLOCKED,
      };
   }


   if (!user && otpType === OTP_TYPES.SIGNUP) {
      user = await User.create({
         countryCode,
         phone,
         role
      });
   }

   if (!user)
      return {
         success: false,
         message: USER.NOT_FOUND,
      };


   const { token, expiry } = generateJWT(user._id);

   await Session.findOneAndUpdate(
      { user: user._id, fcmToken },
      {
         $set: {
            status: SESSION_STATUSES.ACTIVE,
            jti: token,
            jtiExpiry: expiry,
         },
      },
      {
         upsert: true,
         new: true,
         setDefaultsOnInsert: true,
      }
   );


   return {
      success: true,
      message: OTP.VERIFIED_SUCCESS,
      token,
      user,
   };
};


exports.logout = async (userId, token) => {
   const session = await Session.findOne({ user: userId, jti: token });

   if (!session) {
      return {
         success: false,
         message: SESSION.NOT_FOUND,
      };
   }

   session.status = SESSION_STATUSES.REVOKED;
   await session.save();

   return {
      success: true,
      message: SESSION.LOGGED_OUT,
   };
};


