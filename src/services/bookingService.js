// @ts-check
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const { AVAILABILITIES, BOOKING, ERROR, SUCCESS } = require('../constants/message');
const AvailabilityInstance = require('../models/availabilityInstance');
const Booking = require('../models/booking');


exports.bookSlot = async (clientId, providerId, slotId) => {
   const instance = await AvailabilityInstance.findOne({
      providerId,
      'slots._id': slotId
   });

   if (!instance) {
      return { success: false, message: AVAILABILITIES.NOT_FOUND };
   }

   const slot = instance.slots.id(slotId);
   if (!slot || slot.isBooked) {
      return { success: false, message: AVAILABILITIES.ALREADY_BOOKED };
   }

   const booking = await Booking.create({
      clientId,
      providerId,
      date: instance.date,
      start: slot.start,
      end: slot.end,
      availabilityInstanceId: instance._id,
      slotId: slot._id
   });

   slot.isBooked = true;
   await instance.save();

   return {
      success: true,
      message: BOOKING.SUCCESS,
      data: booking
   };
};


exports.getUserBookingsById = async (id, page = 1, limit = 10) => {
   const skip = (page - 1) * limit;

   const result = await Booking.aggregate([
      {
         $match: {
            $or: [
               { clientId: new ObjectId(id) },
               { providerId: new ObjectId(id) }
            ]
         }
      },
      {
         $lookup: {
            from: 'users',
            localField: 'clientId',
            foreignField: '_id',
            as: 'client',
            pipeline: [
               { $project: { fullName: 1, phone: 1, _id: 1 } }
            ]
         }
      },
      { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
      {
         $lookup: {
            from: 'users',
            localField: 'providerId',
            foreignField: '_id',
            as: 'provider',
            pipeline: [
               { $project: { fullName: 1, phone: 1, _id: 1 } }
            ]
         }
      },
      { $unwind: { path: '$provider', preserveNullAndEmptyArrays: true } },
      {
         $project: {
            date: 1,
            start: 1,
            end: 1,
            client: 1,
            provider: 1,
         }
      },
      {
         $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: limit }]
         }
      }
   ]);

   const bookings = result[0]?.data || [];
   const total = result[0]?.metadata[0]?.total || 0;

   return {
      success: true,
      data: {
         results: bookings,
         total,
         page,
         limit
      },
      message: SUCCESS.FETCHED
   };
};

exports.getAllBookings = async (id, page = 1, limit = 10, search = '') => {
  const skip = (page - 1) * limit;

  const matchStage = id
    ? {
        $or: [
          { clientId: new ObjectId(id) },
          { providerId: new ObjectId(id) }
        ]
      }
    : {};

  const result = await Booking.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: 'users',
        localField: 'clientId',
        foreignField: '_id',
        as: 'client',
        pipeline: [
          { $project: { fullName: 1, phone: 1, _id: 1 } }
        ]
      }
    },
    { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'users',
        localField: 'providerId',
        foreignField: '_id',
        as: 'provider',
        pipeline: [
          { $project: { fullName: 1, phone: 1, _id: 1 } }
        ]
      }
    },
    { $unwind: { path: '$provider', preserveNullAndEmptyArrays: true } },

    ...(
      search
        ? [{
            $match: {
              $or: [
                { 'client.fullName': { $regex: search, $options: 'i' } },
                { 'client.phone': { $regex: search, $options: 'i' } },
                { 'provider.fullName': { $regex: search, $options: 'i' } },
                { 'provider.phone': { $regex: search, $options: 'i' } }
              ]
            }
          }]
        : []
    ),

    {
      $project: {
        date: 1,
        start: 1,
        end: 1,
        client: 1,
        provider: 1
      }
    },
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: skip }, { $limit: limit }]
      }
    }
  ]);

  const bookings = result[0]?.data || [];
  const total = result[0]?.metadata[0]?.total || 0;

  return {
    success: true,
    data: {
      results: bookings,
      total,
      page,
      limit
    },
    message: SUCCESS.FETCHED
  };
};