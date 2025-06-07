const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  start: { type: String, required: true }, // Format: "09:00"
  end: { type: String, required: true }    // Format: "09:30"
}, { _id: false });

const AvailabilityTemplateSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  weekday: { type: Number, required: true, min: 0, max: 6 }, // 0 = Sunday
  slots: { type: [SlotSchema], default: [] }
}, { timestamps: true , versionKey: false });

AvailabilityTemplateSchema.index({ providerId: 1, weekday: 1 }, { unique: true });

module.exports = mongoose.model('AvailabilityTemplate', AvailabilityTemplateSchema);
