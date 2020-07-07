const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const routes = require('./routes');

module.exports = {
    init: async({ app }) => {
        app.get('/api/status', (req, res) => { res.status(200).end(); });
        app.head('/api/status', (req, res) => { res.status(200).end(); });
        app.enable('trust proxy');

        app.use(cors());
        app.use(express.json());
        app.use(require('morgan')('dev'));
        app.use(bodyParser.urlencoded({ extended: false }));

        // ...More middlewares

        await routes.init({ app });
        return app;
    }
}