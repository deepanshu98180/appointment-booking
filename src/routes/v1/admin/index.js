// @ts-check
const express = require("express");
const router = express.Router();

const auth = require("./auth");

const bookings = require("./bookings"); 

router.use("/auth", auth);
router.use("/bookings", bookings);




module.exports = router;
