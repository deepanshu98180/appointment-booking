// @ts-check
const { SUCCESS, OTP } = require("../../../constants/message");
const { sendSuccessResponse, errorResponse } = require("../../../utils/responseUtil");
const { sendOtp, verifyOtp, logout } = require("../../../services/userAuthService");
const { ROLES } = require("../../../constants/role");
const role = ROLES.PROVIDER

exports.test = async (req, res, next) => {
   try {
      const result = ["TRUE"]
      if (!result.length) throw new Error("Missing result");
      sendSuccessResponse(res, true, SUCCESS.FETCHED, result);
   } catch (err) {
      next(err);
   }
};

exports.requestOtp = async (req, res, next) => {
   try {
      const { countryCode, phone } = req.body;
      let result = await sendOtp(countryCode, phone,role);

      if (!result.success)
         return errorResponse(res, result.success, result.message);
      sendSuccessResponse(res, result.success, result.message,
         {
            otpType: result.otpType
         }
      );
   } catch (err) {
      next(err);
   }
};

exports.verifyOtp = async (req, res, next) => {
   try {
      const { countryCode, phone, otp, otpType, deviceType, fcmToken } = req.body;

      const result = await verifyOtp({
         countryCode,
         phone,
         otp,
         otpType,
         fcmToken,
         role,
      });

      if (!result.success)
         return errorResponse(res, result.success, result.message);


      return sendSuccessResponse(res, result.success, result.messsage, {
         token: result.token,
         user: result.user,
      });

   } catch (err) {
      next(err);
   }
};

exports.logout = async (req, res, next) => {
   try {
      const userId = req.user._id;
      const token = req.token;
      let result = await logout(userId, token);
      if (!result.success)
         return errorResponse(res, result.success, result.message);
      return sendSuccessResponse(res, result.success, result.message);
   } catch (err) {
      next(err);
   }
};
