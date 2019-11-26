const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String, //username format -> username#discrimanator
    userid: Number,
    point: Number,
    badgePoint: Number,
    avatarUrl: String,
    langArray: []
});

module.exports = mongoose.model("User", UserSchema);

// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//     username: {
//         type: String
//     }, //username format -> username#discrimanator
//     userid: {
//         type: Number
//     },
//     point: {
//         type: Number,
//         default: 0
//     },
//     badgePoint: {
//         type: Number,
//         default: 0
//     },
//     avatarUrl: {
//         type: String
//     },
//     langArray: {
//         type: Array,
//         default: []
//     }
// });

// module.exports = mongoose.model("User", UserSchema);