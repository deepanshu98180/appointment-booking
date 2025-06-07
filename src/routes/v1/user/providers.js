// @ts-check
const express = require("express");
const router = express.Router();
const providers = require("../../../controllers/v1/user/providersController");
const validate = require("../../../middlewares/validation");
const { authenticateUserToken } = require("../../../middlewares/auth");
const { getAvailability } = require("../../../validations/providerValidation");

router.get("/", authenticateUserToken, providers.getProviders);
router.get("/availability/:id", authenticateUserToken, providers.getAvailability);
router.get("/availability/slots/:id", authenticateUserToken,validate(getAvailability, 'query'), providers.getSlots);


module.exports = router;
