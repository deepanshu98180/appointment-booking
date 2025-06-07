const express = require("express");
const router = express.Router();
const auth=require("../../../controllers/v1/provider/authController");
const validate = require("../../../middlewares/validation");
const { validateSendOtp, validateVerifyOtp } = require("../../../validations/providerValidation");
const { authenticateUserToken } = require("../../../middlewares/auth");

router.get("/test", auth.test);
router.post("/otp",validate(validateSendOtp,'body'),auth.requestOtp);
router.post("/verify",validate(validateVerifyOtp,'body'), auth.verifyOtp);
router.post("/logout",authenticateUserToken, auth.logout);

module.exports = router;
