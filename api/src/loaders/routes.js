const userController = require('./../api/user');

module.exports = {
    init: async ({ app }) => {
        app.use('/api', userController);
        return app;
    }
}