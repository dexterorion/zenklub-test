const express = require('express');
const { validationResult  } = require('express-validator');
const router = express.Router();
const AvailabilityService = require('../services/availability');
const AvailabilityValidators = require('./validators/availability');
const auth = require('./../middleware/auth');

// get user availabilityby id
router.get('/availability/:availabilityId', auth, (req, res) => {
    AvailabilityService.get(req.params.availabilityId, req.user, (err, availability) => {
        if (err) {
            return res.status(500).send({error: err.toString()})
        }

        return res.status(200).send({ data: availability });
    });
});

// updates user availability
router.put('/availability/:availabilityId', auth, AvailabilityValidators.update, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }

    AvailabilityService.update(req.params.availabilityId, req.body, req.user, (err, availability) => {
        if (err) {
            return res.status(500).send({error: err.toString()})
        }

        return res.status(204).send();
    });
});

// gets user availability
router.get('/availability', auth, (req, res) => {
    AvailabilityService.list(req.user, (err, availabilities) => {
        if (err) {
            return res.status(500).send({error: err.toString()})
        }

        return res.status(200).send({ data: availabilities });
    });
});

// creates user availability
router.post('/availability', auth, AvailabilityValidators.create, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }

    AvailabilityService.create(req.body, req.user, (err, availability) => {
        if (err) {
            return res.status(500).send({error: err.toString()})
        }

        return res.status(201).send({ data: availability });
    });
});

// get time slots per user id
router.get('/availability/:userId/slots', AvailabilityValidators.slots, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }
    
    AvailabilityService.slots(req.params.userId, req.query, (err, slots) => {
        if (err) {
            return res.status(500).send({error: err.toString()})
        }

        return res.status(200).send({ data: slots });
    });
})

module.exports = router;