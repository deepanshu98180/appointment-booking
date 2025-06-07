const Joi = require("joi");
const { GENDERS } = require("../constants/gender");
const { MARTIAL_STATUS } = require("../constants/martialStatus");
const { USER_STATUSES } = require("../constants/userStatus");
const { OTP_TYPES } = require("../constants/otp");
const validateSendOtp = Joi.object({
    countryCode: Joi.string().required().label("Country Code"),
    phone: Joi.string().required().label("Phone"),
});

const validateVerifyOtp = Joi.object({
    countryCode: Joi.string().required().label("Country Code"),
    phone: Joi.string().required().label("Phone"),
    otp: Joi.string().required().label("OTP"),
    otpType: Joi.string().valid(...Object.values(OTP_TYPES)).required().label("OTP Type"),
    fcmToken: Joi.string().required().label("Notification Token"),
});

const validateUpdateUserProfile = Joi.object({
    fullName: Joi.string().required().label("Full Name"),
});

const updateUserStatus = Joi.object({
    status: Joi.string().valid(...Object.values(USER_STATUSES)).required().label("Status"),
});
const getAvailability = Joi.object({
    date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .label("Date (YYYY-MM-DD)"),
});
const setAvailability = Joi.object({
  templates: Joi.array()
    .items(
      Joi.object({
        weekday: Joi.number()
          .integer()
          .min(0)
          .max(6)
          .required()
          .label("Weekday (0 = Sunday, 6 = Saturday)"),
        slots: Joi.array()
          .items(
            Joi.object({
              start: Joi.string()
                .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
                .required()
                .label("Start Time (HH:mm)"),
              end: Joi.string()
                .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
                .required()
                .label("End Time (HH:mm)")
            })
          )
          .min(1)
          .required()
          .label("Slots")
      })
    )
    .min(1)
    .required()
    .label("Templates")
});


module.exports = {
    validateSendOtp,
    validateVerifyOtp,
    validateUpdateUserProfile,
    updateUserStatus,
    getAvailability,
    setAvailability
};
