// @ts-check
const express = require("express");
const router = express.Router();
const bookings = require("../../../controllers/v1/admin/bookingsController");
const validate = require("../../../middlewares/validation");
const { authenticateAdminToken } = require("../../../middlewares/auth");
const { allBookings } = require("../../../validations/adminValidation");

router.get("/", authenticateAdminToken,validate(allBookings,'query'), bookings.getBookings);


module.exports = router;
