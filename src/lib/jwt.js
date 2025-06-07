const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { ROLES } = require("../constants/role");

function generateJWT(userId, type = ROLES.USER) {
   const expiry = Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60; // 15 days
   const secret =
      type === ROLES.ADMIN ? env.ADMIN_JWT_SECRET : env.USER_JWT_SECRET;
   const token = jwt.sign({ _id: userId, exp: expiry }, secret);
   return {
      token,
      expiry: new Date(expiry * 1000),
   };
}

module.exports = { generateJWT };