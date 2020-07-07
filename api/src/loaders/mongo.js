const mongoose = require('mongoose');
const config = require('../config');

module.exports = {
  init: async () => {
    const connection = await mongoose.connect(config.databaseURL, { useNewUrlParser: true });
    return connection.connection.db;
  }
}