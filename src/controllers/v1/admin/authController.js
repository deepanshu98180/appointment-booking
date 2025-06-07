// @ts-check
const { SUCCESS, OTP } = require("../../../constants/message");
const { sendSuccessResponse, errorResponse } = require("../../../utils/responseUtil");

const { adminLogin, changeAdminPassword, verifyAdminOtp, sendAdminOtp } = require('../../../services/adminAuthService');


exports.login = async (req, res, next) => {
  try {
    const { email, password, fcmToken } = req.body;
    const result = await adminLogin({ email, password, fcmToken });

    if (!result.success)
      return errorResponse(res, result.success, result.message);

    return sendSuccessResponse(res, result.success, result.message, {
      token: result.token,
      admin: result.admin,
    });
  } catch (err) {
    next(err);
  }
};

exports.sendOtp = async (req, res, next) => {
  try {
    const { email, otpType } = req.body;

    const result = await sendAdminOtp({ email, otpType });

    if (!result.success)
      return errorResponse(res, result.success, result.message);

    return sendSuccessResponse(res, result.success, result.message);
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, otpType, fcmToken } = req.body;

    const result = await verifyAdminOtp({ email, otp, otpType, fcmToken });

    if (!result.success)
      return errorResponse(res, result.success, result.message);

    return sendSuccessResponse(res, result.success, result.message, {
      token: result.token,
      admin: result.admin,
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const adminId= req.user._id;
    const { email, password } = req.body;

    const result = await changeAdminPassword({ adminId,email, password });

    if (!result.success)
      return errorResponse(res, result.success, result.message);

    return sendSuccessResponse(res, result.success, result.message);
  } catch (err) {
    next(err);
  }
};

// exports.logout = async (req, res, next) => {
//   try {
//     const adminId = req.user._id;
//     const token = req.token;

//     const result = await adminLogout({ adminId, token });

//     if (!result.success)
//       return errorResponse(res, result.success, result.message);

//     return sendSuccessResponse(res, result.success, result.message);
//   } catch (err) {
//     next(err);
//   }
// };
