// @ts-check
const AvailabilityTemplate = require('../models/availabilityTemplate');
const AvailabilityInstance = require('../models/availabilityInstance');
const { SUCCESS, AVAILABILITIES } = require('../constants/message');
const Booking = require('../models/booking');
const { default: mongoose } = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
/*
NOTE: in setAvailabilityTemplate im calling generateAvailabilityForPeriod once for generating n no. of slots
      but in real case scenario generateAvailabilityForPeriod will be called using cron (every midnight )to 
      make the next n of slots available 
*/
exports.setAvailabilityTemplate = async (providerId, templates) => {

   await AvailabilityTemplate.deleteMany({ providerId });//as old templates will be of no further use

   for (const cv of templates) {
      cv.providerId = providerId;
   }
   await AvailabilityTemplate.insertMany(templates);

   const bookedInstanceIds = await Booking.distinct('availabilityInstanceId', {
      providerId,
      date: { $gte: new Date() }
   });

   await AvailabilityInstance.deleteMany({
      providerId,
      date: { $gte: new Date() },
      _id: { $nin: bookedInstanceIds }
   }); /*
    here i am deleting old unbooked slots, though this will also keep the slots from that same instance from deleting
   but we can easily tackle that my marking isBooked as true for other slots of that instanceof (not doing for now)
      */


   await exports.generateAvailabilityForPeriod(providerId, 30);
   //i am creating slots for next 30 days (this can be dynamic depending on client's needs)


   return {
      success: true,
      message: AVAILABILITIES.SUCCESS
   };
};

exports.generateAvailabilityForPeriod = async (providerId, numDays = 30) => {
   const templates = await AvailabilityTemplate.find({ providerId });
   const createdDates = [];

   const today = new Date();
   today.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC

   for (let i = 0; i < numDays; i++) {
      const date = new Date(today); // base is today UTC midnight
      date.setUTCDate(today.getUTCDate() + i);

      const weekday = date.getUTCDay(); // 0 (Sun) to 6 (Sat)
      const template = templates.find(t => t.weekday === weekday);
      if (!template) continue;

      const exists = await AvailabilityInstance.exists({ providerId, date });
      if (exists) continue;

      await AvailabilityInstance.create({
         providerId,
         date,
         slots: template.slots.map(s => ({ ...s, isBooked: false }))
      });

      createdDates.push(date);
   }

   return createdDates;
};


exports.getAvailability = async (providerId) => {

   const availability = await AvailabilityTemplate.find({ providerId });

   if (!availability) {
      return { success: false, message: 'No availability found for this date' };
   }

   return { success: true, data: availability };
};
exports.getSlotsByDate = async (providerId, inputDate) => {
   const date = new Date(inputDate);
   date.setUTCHours(0, 0, 0, 0); // Normalize to UTC midnight

   const availability = await AvailabilityInstance.findOne({ providerId, date });

   if (!availability) {
      return { success: false, message: 'No availability found for this date' };
   }

   return { success: true, data: availability };
};

exports.getAvailableDatesForProvider = async (providerId) => {
  const results = await AvailabilityInstance.aggregate([
  { $match: { providerId: new ObjectId(providerId), 'slots.isBooked': false } },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$date" }
      }
    }
  },
  { $sort: { _id: 1 } },
  {
    $project: {
      date: "$_id",
      _id: 0
    }
  }
]);

   if (!results.length) {
      return { success: false, message: AVAILABILITIES.NO_DATES };
   }
   const dates = results.map(r => r.date);

   return { success: true, data: dates };
};
