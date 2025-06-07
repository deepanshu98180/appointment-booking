// @ts-check
const express = require("express");
const router = express.Router();
const auth = require("../../../controllers/v1/admin/authController");
const validate = require("../../../middlewares/validation");
const { validateAdminLogin } = require("../../../validations/adminValidation");

router.post("/login", validate(validateAdminLogin, 'body'), auth.login);

module.exports = router;
