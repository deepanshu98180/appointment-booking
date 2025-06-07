// @ts-check
const {
   setAvailabilityTemplate,
   getAvailability,
   getSlotsByDate
} = require('../../../services/userAvailabilityService');
const { sendSuccessResponse, errorResponse } = require('../../../utils/responseUtil');

/*
 For slots creation im using the concept of templates(not visible to users directly for booking)
 through which i generate literal slots(visible to users for bookings)
    */

exports.setAvailability = async (req, res, next) => {
   try {
      const providerId = req.user._id;
      const templates = req.body.templates;

      const result = await setAvailabilityTemplate(providerId, templates);
      return sendSuccessResponse(res, result.success, result.message);
   } catch (err) {
      return next(err);
   }
};

exports.getAvailability = async (req, res, next) => {
   try {
      const providerId = req.user._id;

      const result = await getAvailability(providerId);
      if (!result.success)
         return sendSuccessResponse(res, result.success, result.message);

      return sendSuccessResponse(res, result.success, result.message, result.data);
   } catch (err) {
      return next(err);
   }
};
exports.getSlots = async (req, res, next) => {
   try {
      const providerId = req.user._id;
      const date = req.query.date; // format: '2025-06-10'

      const result = await getSlotsByDate(providerId, date);
      if (!result.success)
         return sendSuccessResponse(res, result.success, result.message);

      return sendSuccessResponse(res, result.success, result.message, result.data);
   } catch (err) {
      return next(err);
   }
};
