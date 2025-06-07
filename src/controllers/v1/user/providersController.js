// @ts-check
const { SUCCESS, OTP } = require("../../../constants/message");
const { sendSuccessResponse, errorResponse } = require("../../../utils/responseUtil");
const { sendOtp, verifyOtp, logout } = require("../../../services/userAuthService");
const { getUsers } = require("../../../services/userProfileService");
const { ROLES } = require("../../../constants/role");
const { USER_STATUSES } = require("../../../constants/userStatus");
const { getAvailableDatesForProvider, getSlotsByDate } = require("../../../services/userAvailabilityService");
const role = ROLES.USER

exports.getProviders = async (req, res, next) => {
   try {
      let result = await getUsers(ROLES.PROVIDER, USER_STATUSES.ACTIVE );//i have not added pagination just for sample
      if (!result.success)
         return sendSuccessResponse(res, result.success, result.message);
      return sendSuccessResponse(res, result.success, result.message, result.user);
   } catch (err) {
      next(err);
   }
};

exports.getAvailability = async (req, res, next) => {
   try {
      const providerId = req.params.id;

      const result = await getAvailableDatesForProvider(providerId);
      if (!result.success)
         return sendSuccessResponse(res, result.success, result.message);

      return sendSuccessResponse(res, result.success, result.message, result.data);
   } catch (err) {
      return next(err);
   }
};
exports.getSlots = async (req, res, next) => {
   try {
      const providerId = req.params.id;
      const date = req.query.date; // format: '2025-06-10'

      const result = await getSlotsByDate(providerId, date);
      if (!result.success)
         return sendSuccessResponse(res, result.success, result.message);

      return sendSuccessResponse(res, result.success, result.message, result.data);
   } catch (err) {
      return next(err);
   }
};
