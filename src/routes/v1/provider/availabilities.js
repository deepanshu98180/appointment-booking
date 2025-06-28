// @ts-check
const express = require("express");
const router = express.Router();
const availability = require("../../../controllers/v1/provider/availabilityController");
const validate = require("../../../middlewares/validation");
const { authenticateUserToken } = require("../../../middlewares/auth");
const { getAvailability, setAvailability } = require("../../../validations/providerValidation");

router.get("/", authenticateUserToken, availability.getAvailability);
router.get("/slots", authenticateUserToken, validate(getAvailability, 'query'), availability.getSlots);
router.post("/", authenticateUserToken, validate(setAvailability, 'body'), availability.setAvailability);

module.exports = router;
