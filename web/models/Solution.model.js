const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SolutionSchema = new Schema({
    url: String,
    dayNumber: Number,
    userName: String,
    userid: Number,
    langName: String,
    avatarUrl: String,
    Time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Solution", SolutionSchema);

// const mongoose = require("mongoose");

// const SolutionsSchema = new mongoose.Schema({
//     date: {
//         type: Date,
//         default: Date.now
//     },
//     url: {
//         type: String
//     },
//     dayNumber: {
//         type: Number
//     },
//     userName: {
//         type: String
//     },
//     userid: {
//         type: Number
//     },
//     langName: {
//         type: String,
//         default: "Javascript"
//     },
//     avatarUrl: {
//         type: String
//     }
// });

// module.exports = mongoose.model("snippets", SolutionsSchema);
