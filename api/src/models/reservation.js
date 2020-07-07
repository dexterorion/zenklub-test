const mongoose = require('mongoose');
const constants = require('../config/constants');

const reservationSchema = mongoose.Schema({
    // availability
    availabilityId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    // user that is assigned to this specific reservation
    customerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    canceled: Boolean
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;