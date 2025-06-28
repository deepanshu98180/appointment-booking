// @ts-check

const { getAllBookings } = require('../../../services/bookingService');
const { sendSuccessResponse, errorResponse } = require('../../../utils/responseUtil');


exports.getBookings = async (req, res, next) => {
  try {
    const id = req.query.id || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;

    const result = await getAllBookings(id, page, limit, search);
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (err) {
    return next(err);
  }
};
