// @ts-check

const { bookSlot, getUserBookingsById } = require('../../../services/bookingService');
const { sendSuccessResponse, errorResponse } = require('../../../utils/responseUtil');


exports.createBooking = async (req, res, next) => {
   /*
      i'm letting the user book directly with no payment gateway integration as of now ,
         for payment gateway i would have :
            created a booking with status and payment status as pending
            on payment gateway webhook hit i would have changed those status and marked the booking as successfully booked.
    */

   try {
      const clientId = req.user._id;
      const { providerId, slotId } = req.body;

      const result = await bookSlot(clientId, providerId, slotId);
      if (!result.success)
         return errorResponse(res, result.success, result.message);

      return sendSuccessResponse(res, true, result.message, result.data);
   } catch (err) {
      return next(err);
   }
};

exports.getBookings = async (req, res, next) => {
   try {
      const clientId = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await getUserBookingsById(clientId, page, limit);
      return sendSuccessResponse(res, 200, result.message, result.data);
   } catch (err) {
      return next(err);
   }
};