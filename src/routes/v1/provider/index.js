// @ts-check
const express = require("express");
const router = express.Router();

const providerAuthRoutes = require("./auth");
const userProfileRoutes = require("./profile");
const availability = require("./availabilities");

router.use("/auth", providerAuthRoutes);
router.use("/profile", userProfileRoutes);
router.use("/availability", availability);



module.exports = router;
