const Joi = require("joi");
const { GENDERS } = require("../constants/gender");
const { MARTIAL_STATUS } = require("../constants/martialStatus");
const { USER_STATUSES } = require("../constants/userStatus");
const { OTP_TYPES } = require("../constants/otp");
const { default: mongoose } = require("mongoose");
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
const bookSlotSchema = Joi.object({
    providerId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }, 'ObjectId Validation')
        .optional()
        .label('Provider ID'),
    slotId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }, 'ObjectId Validation')
        .optional()
        .label('Slot ID'),



});

module.exports = {
    validateSendOtp,
    validateVerifyOtp,
    validateUpdateUserProfile,
    updateUserStatus,
    bookSlotSchema
};
