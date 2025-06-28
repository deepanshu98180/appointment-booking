const mongoose = require('mongoose');

const BookableSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  isBooked: { type: Boolean, default: false }
});

const AvailabilityInstanceSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  date: { type: Date, required: true },
  slots: {
    type: [BookableSlotSchema], default: []
  }
}, { timestamps: true, versionKey: false });

AvailabilityInstanceSchema.index({ providerId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AvailabilityInstance', AvailabilityInstanceSchema);
