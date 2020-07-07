const { body, query } = require('express-validator');
const constants = require('../../config/constants');

module.exports = {
    create: [
        body('timeRange.*.startHour').isInt(),
        body('timeRange.*.startMinute').isInt(),
        body('timeRange.*.endHour').isInt(),
        body('timeRange.*.endMinute').isInt(),
        body('weekday').isIn(constants.weekdays)
    ],
    update: [
        body('timeRange.*.startHour').isInt(),
        body('timeRange.*.startMinute').isInt(),
        body('timeRange.*.endHour').isInt(),
        body('timeRange.*.endMinute').isInt()
    ],
    slots: [
        query('weekday').isIn(constants.weekdays),
        query('startTime').matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/g),
        query('endTime').matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/g)
    ]
}