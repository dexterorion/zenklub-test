const Availability = require('./../models/availability');
const Reservation = require('./../models/reservation');

module.exports = {
    create: async (data, user, callback) => {
        const found = await Availability.findOne({weekday: data.weekday});
        if (found) {
            return callback(new Error('You already have availability set for this weekday. Please, use update method'));
        }

        const availability = new Availability(data);
        availability.professionalId = user.id;
        return availability.save((err, saved) => {
            if (err) {
                return callback(new Error('Some error happened when creating professional availability. Please, try again'));
            }

            return callback(null, saved);
        });
    },
    update: async (id, data, user, callback) => {
        const availability = await Availability.findById(id);
        if (!availability || availability.professionalId != user.id) {
            return callback(new Error('You don\'t have access to get this availability.'));
        }

        const reservation = await Reservation.findOne({availabilityId: id, canceled: false });
        if (reservation) {
            return callback(new Error('You cannot update your availability with an active reservation.'));
        }

        availability.timeRange = data.timeRange;
        return availability.save((err, updated) => {
            if (err) {
                return callback(new Error('Some error happened when updating professional availability. Please, try again'));
            }

            return callback(null, updated);
        });
    },
    get: async (id, user, callback) => {
        const availability = await Availability.findById(id);
        if (!availability || availability.professionalId != user.id) {
            return callback(new Error('You don\'t have access to get this availability.'));
        }

        return callback(null, availability);
    },
    list: (user, callback) => {
        return Availability.find({professionalId: user.id}, (err, results) => {
            if (err) {
                return callback(new Error(`Error getting your availabilities. Please, try again.`))
            }

            return callback(null, results);
        })
    },
    slots: (userId, query, callback) => {
        return Availability.find({professionalId: userId}, (err, results) => {
            if (err) {
                return callback(new Error(`Error getting slots. Please, try again.`))
            }

            return callback(null, results);
        });
    }
}