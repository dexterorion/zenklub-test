const express = require('express');
const cors = require('cors');
const app = express();
const dbTest = require('./db');
const userController = require('./../../src/api/user');
const availabilityController = require('./../../src/api/availability');

app.use(express.json())
app.use(cors());

app.use('/api', userController);
app.use('/api', availabilityController);

module.exports = app;