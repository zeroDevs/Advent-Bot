const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = mongoose.model("Solution", SolutionSchema);
