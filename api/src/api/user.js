const express = require('express');
const { validationResult  } = require('express-validator');
const router = express.Router();
const UserService = require('../services/user');
const UserValidators = require('./validators/user');

router.post('/users', UserValidators.create, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }

    return UserService.createUser(req.body, (err, user) => {
        if (err) {
            return res.status(500).send({error: err.toString()})
        }

        return res.status(201).send({ data: true });
    });
});

router.post('/users/login', UserValidators.login, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }

    UserService.login(req.body, (err, token) => {
        if (err) {
            return res.status(401).send({error: 'Invalid email or password'});
        }

        return res.status(201).send({ data: token });
    });
});

module.exports = router;