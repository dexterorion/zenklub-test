const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('./../config');

const auth = async(req, res, next) => {
    try {
        if (!req.header('Authorization')) {
            return res.status(401).send({ error: 'Unauthorized' });
        }

        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, config.jwtToken);
        
        User.findOne({ 
            _id: data._id,
            'tokens.token': token 
        }, (err, found) => {
            if (err) {
                return res.status(401).send({ error: err.toString() });
            }

            if (!found) {
                return res.status(401).send({ error: 'User not found' });
            }

            req.user = found;
            req.token = token;
            next();
        });
    } catch(e) {
        return res.status(401).send({ error: e.toString() });
    }
}
module.exports = auth