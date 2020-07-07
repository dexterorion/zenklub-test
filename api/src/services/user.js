const User = require('../models/user');

module.exports = {
    createUser: (data, callback) => {
        const user = new User(data);
        return user.save((err, saved) => {
            if (err) {
                return callback(new Error('Some error happened when creating your user. Please, try again'));
            }

            return callback(null, saved);
        });
    },
    login: async (data, callback) => {
        try {
            const { email, password } = data;

            const user = await User.findByCredentials(email, password);
            const token = await user.generateAuthToken();

            return callback(null, token);
        } catch (error) {
            return callback(error);
        }
    }
}