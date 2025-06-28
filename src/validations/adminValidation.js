const Joi = require("joi");
const { OTP_TYPES } = require("../constants/otp");
const { USER_STATUSES } = require("../constants/userStatus");
const { CATEGORY_TYPES, CATEGORY_STATUS } = require("../constants/category");
const { default: mongoose } = require("mongoose");

const validateAdminLogin = Joi.object({
   email: Joi.string().required().label("Email"),
   password: Joi.string().required().label("Password"),
});
const allBookings = Joi.object({
   id: Joi.string()
      .custom((value, helpers) => {
         if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
         }
         return value;
      }, 'ObjectId Validation')
      .optional()
      .label('User ID'),

   page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .label('Page Number'),

   limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .label('Limit'),

   search: Joi.string()
      .trim()
      .optional()
      .label('Search Query'),
});
module.exports = {
   validateAdminLogin,
   allBookings
};
