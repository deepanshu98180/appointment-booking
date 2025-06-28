// @ts-check
const OtpVerification = require("../models/otp");
const User = require("../models/user");
const Session = require("../models/session");
const { SESSION_STATUSES } = require("../constants/sessionStatus");
const { generateJWT } = require("../lib/jwt");
const { OTP, USER, SESSION, SUCCESS, ADMIN_MESSAGES } = require("../constants/message");

const Admin = require('../../src/models/admin');
const bcrypt = require('bcryptjs');
const { comparePassword, hashPassword } = require("../lib/bcrypt");
const { ROLES } = require("../constants/role");
const { USER_STATUSES } = require("../constants/userStatus");
const { OTP_STATUSES, OTP_TYPES, OTP_CHANNELS } = require("../constants/otp");

const createAdmin = async ({ email, password, type = ROLES.SUBADMIN, status = USER_STATUSES.ACTIVE }) => {
   const existing = await Admin.findOne({ email });
   if (existing) {
      return {
         success: false,
         message: 'Admin with this email already exists',
      };
   }

   const hashedPassword = await hashPassword(password);

   const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
      type,
      status,
   });

   return {
      success: true,
      message: 'Admin created successfully',
      admin: newAdmin,
   };
};

exports.adminLogin = async ({ email, password, fcmToken }) => {
   const admin = await Admin.findOne({ email }).select('email type name password status').lean();

   if (!admin || admin.status !== 'ACTIVE') {
      return {
         success: false,
         message: ADMIN_MESSAGES.INVALID_CREDENTIALS,
      };
   }

   const isMatch = await comparePassword(password, admin.password);
   if (!isMatch) {
      return {
         success: false,
         message: ADMIN_MESSAGES.INVALID_CREDENTIALS,
      };
   }

   const { token, expiry } = generateJWT(admin._id,ROLES.ADMIN);

   await Session.create(
      {
         user: admin._id, fcmToken,
         status: SESSION_STATUSES.ACTIVE,
         jti: token,
         jtiExpiry: expiry,
      }
   );

   const { password: _, ...adminWithoutPassword } = admin;

   return {
      success: true,
      message: ADMIN_MESSAGES.LOGIN_SUCCESS,
      token,
      admin: adminWithoutPassword,
   };
};

exports.adminLogout = async ({ adminId, token }) => {
   const session = await Session.findOne({ user: adminId, jti: token });
   if (!session) {
      return {
         success: false,
         message: ADMIN_MESSAGES.SESSION_NOT_FOUND,
      };
   }

   session.status = SESSION_STATUSES.REVOKED;
   await session.save();

   return {
      success: true,
      message: ADMIN_MESSAGES.LOGOUT_SUCCESS,
   };
};


exports.sendAdminOtp = async ({ email, otpType }) => {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return {
      success: false,
      message: ADMIN_MESSAGES.ADMIN_NOT_FOUND,
    };
  }

  const otp = 1234
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await OtpVerification.findOneAndUpdate(
    { email, otpType },
    {
      type: OTP_CHANNELS.WEB,
      email,
      otpType,
      otp: otp,
      status: OTP_STATUSES.PENDING,
      otpExpiry,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

//   await createFuntoSenEMail(email, otp); 

  return {
    success: true,
    message: OTP.SENT_SUCCESS,
  };
};


exports.verifyAdminOtp = async ({ email, otp, otpType, fcmToken }) => {
  const record = await OtpVerification.findOne({
    email,
    otp: otp,
    otpType,
    status: OTP_STATUSES.PENDING,
    otpExpiry: { $gt: new Date() },
  });

  if (!record) {
    return {
      success: false,
      message: OTP.INVALID_OTP,
    };
  }

  record.status = OTP_STATUSES.VERIFIED;
  await record.save();

  const admin = await Admin.findOne({ email });

  if (!admin || admin.status !== 'ACTIVE') {
    return {
      success: false,
      message: ADMIN_MESSAGES.ADMIN_NOT_FOUND_OR_INACTIVE,
    };
  }

  const { token, expiry } = generateJWT(admin._id,ROLES.ADMIN);

  await Session.findOneAndUpdate(
    { user: admin._id, fcmToken },
    {
      $set: {
        status: SESSION_STATUSES.ACTIVE,
        jti: token,
        jtiExpiry: expiry,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const { password: _, ...adminWithoutPassword } = admin.toObject();

  return {
    success: true,
    message: OTP.VERIFIED_SUCCESS,
    token,
    admin: adminWithoutPassword,
  };
};


exports.changeAdminPassword = async ({ adminId,email, password }) => {
  const otpDoc = await OtpVerification.findOne({
    email,
    otpType: OTP_TYPES.FORGOT,
    status: OTP_STATUSES.VERIFIED,
  });

  if (!otpDoc) {
    return {
      success: false,
      message: OTP.NOT_VERIFIED,
    };
  }

  const hashedPassword = await hashPassword(password);
  await Admin.updateOne({  _id:adminId, email }, { password: hashedPassword });

  await OtpVerification.deleteOne({ _id: otpDoc._id }); // Clean up

  return {
    success: true,
    message: ADMIN_MESSAGES.PASSWORD_RESET_SUCCESS,
  };
};



