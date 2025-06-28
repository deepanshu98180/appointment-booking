// @ts-check
const express = require("express");
const router = express.Router();
const booking = require("../../../controllers/v1/user/bookingController");
const validate = require("../../../middlewares/validation");
const {  bookSlotSchema } = require("../../../validations/userValidation");
const { authenticateUserToken } = require("../../../middlewares/auth");

router.get("/", authenticateUserToken, booking.getBookings);
router.post("/",authenticateUserToken,validate(bookSlotSchema,'body'),booking.createBooking);

module.exports = router;
