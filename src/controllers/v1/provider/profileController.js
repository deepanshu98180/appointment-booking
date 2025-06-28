// @ts-check
const { SUCCESS, OTP } = require("../../../constants/message");
const { sendSuccessResponse, errorResponse } = require("../../../utils/responseUtil");
const { sendOtp, verifyOtp, logout } = require("../../../services/userAuthService");
const { getBaseDetails, updateUserDetails: updateUserDetails } = require("../../../services/userProfileService");

exports.getProfile = async (req, res, next) => {
   try {
      const userId = req.user._id;
      let result = await getBaseDetails(userId);
      if (!result.success)
         return errorResponse(res, result.success, result.message);
      return sendSuccessResponse(res, result.success, result.message, result.user);
   } catch (err) {
      next(err);
   }
};
exports.updateProfile = async (req, res, next) => {
   try {
      const userId = req.user._id;

      const result = await updateUserDetails(userId, req.body);

      if (!result.success)
         return errorResponse(res, result.success, result.message);

      return sendSuccessResponse(res, result.success, result.message, result.user);
   } catch (err) {
      next(err);
   }
};