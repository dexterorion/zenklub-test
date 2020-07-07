const { body } = require('express-validator');

module.exports = {
    create: [
        body('email').isEmail(),
        body('password').isLength({min: 6}),
        body('name').notEmpty(),
        body('type').isIn(['customer', 'professional'])
    ],
    login: [
        body('email').isEmail(),
        body('password').isLength({min: 6})
    ]
}