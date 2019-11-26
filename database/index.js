const mongoose = require("mongoose");

// pass in the database url
// dsn = database source name
module.exports.connect = async dsn =>
    mongoose.connect(dsn, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
