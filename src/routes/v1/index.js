// @ts-check
const express = require("express");
const router = express.Router();

const userRoutes = require("./user/index");
const providerRoutes = require("./provider/index");
const adminRoutes = require("./admin/index");

router.use("/user", userRoutes);
router.use("/provider", providerRoutes);
router.use("/admin", adminRoutes);


module.exports = router;
