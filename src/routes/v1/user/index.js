// @ts-check
const express = require("express");
const router = express.Router();

const userAuthRoutes = require("./auth");
const userProfileRoutes = require("./profile");
const booking = require("./booking");
const providers = require("./providers");

router.use("/auth", userAuthRoutes);
router.use("/profile", userProfileRoutes);
router.use("/bookings", booking);
router.use("/explore-providers", providers);



module.exports = router;
