const expressLoader = require('./express');
const mongooseLoader = require('./mongo');

module.exports = {
    init: async({ expressApp }) => {
        const mongoConnection = await mongooseLoader.init();
        console.log('MongoDB Initialized');
        await expressLoader.init({ app: expressApp });
        console.log('Express Initialized');
    }
}