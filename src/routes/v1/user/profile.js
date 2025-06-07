// @ts-check
const express = require("express");
const router = express.Router();
const profile=require("../../../controllers/v1/user/profileController");
const validate = require("../../../middlewares/validation");
const  {validateUpdateUserProfile,validateVerifyOtp}  = require("../../../validations/userValidation");
const { authenticateUserToken } = require("../../../middlewares/auth");

router.get("/",authenticateUserToken,profile.getProfile);
router.put("/",validate(validateUpdateUserProfile,'body'),authenticateUserToken,profile.updateProfile);
// router.post("/details",validate(validateSendOtp,'body'),profileController.getProfile);

module.exports = router;
