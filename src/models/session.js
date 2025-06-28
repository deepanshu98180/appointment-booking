const mongoose = require("mongoose");
const {  SESSION_STATUSES } = require("../constants/sessionStatus");

const SessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: Object.values(SESSION_STATUSES),
    default: SESSION_STATUSES.ACTIVE,
  },
  jti: String,
  jtiExpiry: Date,
  fcmToken: String,
}, { timestamps: true });

module.exports = mongoose.model("Session", SessionSchema);
