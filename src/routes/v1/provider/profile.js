// @ts-check
const express = require("express");
const router = express.Router();
const profile = require("../../../controllers/v1/provider/profileController");
const validate = require("../../../middlewares/validation");
const { validateUpdateUserProfile } = require("../../../validations/providerValidation");
const { authenticateUserToken } = require("../../../middlewares/auth");

router.get("/", authenticateUserToken, profile.getProfile);
router.put("/", authenticateUserToken,validate(validateUpdateUserProfile, 'body'),  profile.updateProfile);

module.exports = router;
