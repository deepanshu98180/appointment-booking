
const mongoose = require('mongoose');

// curently not managing any booking or payment statuses 

const BookingSchema = new mongoose.Schema({
   clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', required: true
   },
   providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', required: true
   },
   bookingId: {
      type: String,
      unique: true,
   },
   slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
   },
   availabilityInstanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AvailabilityInstance'
   },
   date: { type: Date, required: true },
   start: { type: String, required: true },
   end: { type: String, required: true }
}, { timestamps: true, versionKey: false });

BookingSchema.pre("save", async function (next) {
  if (!this.isNew || this.bookingId) return next();

  try {
    const latestBooking = await mongoose.model("Bookings")
      .findOne({}, {}, { sort: { createdAt: -1 } });

    if (!latestBooking || !latestBooking.bookingId) {
      this.bookingId = "M1";
    } else {
      const lastId = latestBooking.bookingId;
      const lastNum = parseInt(lastId.replace("M", "")) || 0;
      this.bookingId = `M${lastNum + 1}`;
    }

    next();
  } catch (err) {
    next(err);
  }
});


BookingSchema.index({ clientId: 1 });
BookingSchema.index({ providerId: 1 });

module.exports = mongoose.model('Bookings', BookingSchema);