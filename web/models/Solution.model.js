const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

module.exports = (options) => {

    const year = options.year ? options.year : moment().format('YYYY')

    const SolutionSchema = new Schema({
        url: String,
        dayNumber: Number,
        userName: String,
        userid: Number,
        langName: String,
        avatarUrl: String,
        Time: { type: Date, default: Date.now },
        averageRating: { type: Number, default: 0 }
    });

    const yearDB = mongoose.connection.useDb(`AOC-${year}`);

    return yearDB.model("Solution", SolutionSchema);


}