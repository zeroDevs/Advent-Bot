const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");


module.exports = (options) => {

    const year = options.year ? options.year : moment().format('YYYY')

    const UserSchema = new Schema({
        username: String, //username format -> username#discrimanator
        userid: String,
        point: Number,
        badgePoint: Number,
        avatarUrl: String,
        isZTM: Boolean,
        langArray: []
    });

    const yearDB = mongoose.connection.useDb(`AOC-${year}`);

    return yearDB.model("User", UserSchema);


}