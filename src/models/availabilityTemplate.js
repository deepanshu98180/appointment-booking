const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  start: { type: String, required: true }, 
  end: { type: String, required: true }  
}, { _id: false });

const AvailabilityTemplateSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  weekday: { type: Number, required: true, min: 0, max: 6 },
  slots: { type: [SlotSchema], default: [] }
}, { timestamps: true , versionKey: false });

AvailabilityTemplateSchema.index({ providerId: 1, weekday: 1 }, { unique: true });

module.exports = mongoose.model('AvailabilityTemplate', AvailabilityTemplateSchema);
