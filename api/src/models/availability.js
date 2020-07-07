const mongoose = require('mongoose');
const constants = require('../config/constants');

const availabilitySchema = mongoose.Schema({
    professionalId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    weekday: {
        type: String,
        enum: constants.weekdays,
        required: true
    },
    timeRange: [
        {
            startHour: {
                type: Number,
                required: true
            },
            startMinute: {
                type: Number,
                required: true
            },
            endHour: {
                type: Number,
                required: true
            },
            endMinute: {
                type: Number,
                required: true
            },
        }
    ]
});

availabilitySchema.index({professionalId: 1, weekday: 1});

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;