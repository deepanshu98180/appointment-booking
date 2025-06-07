const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const routes = require("./routes/v1/index");
const errorHandler = require("./middlewares/error");
const env = require("./config/env");
require("./utils/responseUtil");
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(express.json());
app.use(cors());

if (env.NODE_ENV !== 'local') {
  app.use(compression());
}
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), {
  flags: "a",
});

morgan.token("body", (req) => JSON.stringify(req.body));
morgan.token("query", (req) => JSON.stringify(req.query));
app.use(
  morgan(':method :url :status :response-time ms - query: :query - body: :body')
);// Console

app.use(morgan("combined", { stream: accessLogStream })); // File

app.use("/api/v1", routes);

app.use(errorHandler);

module.exports = app;
