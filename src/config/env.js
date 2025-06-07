require("dotenv").config();

const REQUIRED_ENV_VARS = [
  "PORT",
  "MONGO_URI",
  "USER_JWT_SECRET",
  "ADMIN_JWT_SECRET",
  "DB",
  "DB_HOST",
  "DB_PORT",
  "NODE_ENV",
];



const env = REQUIRED_ENV_VARS.reduce((acc, key) => {
  acc[key] = process.env[key];
  return acc;
}, {});

REQUIRED_ENV_VARS.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`X Warning: ${key} is not set in .env file.`);
  }
});

env.PORT = env.PORT || 2408;

module.exports = env;
