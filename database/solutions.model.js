const mongoose = require("mongoose");

const SolutionsSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    url: {
        type: String
    },
    dayNumber: {
        type: Number
    },
    userName: {
        type: String
    },
    userid: {
        type: Number
    },
    langName: {
        type: String,
        default: "Javascript"
    },
    avatarUrl: {
        type: String
    }
});

module.exports = mongoose.model("snippets", SolutionsSchema);
