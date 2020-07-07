const mongoose = require('mongoose')
const config = require('./config');

mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})