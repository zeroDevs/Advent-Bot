const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    }, //username format -> username#discrimanator
    userid: {
        type: Number
    },
    point: {
        type: Number,
        default: 0
    },
    badgePoint: {
        type: Number,
        default: 0
    },
    avatarUrl: {
        type: String
    },
    langArray: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("User", UserSchema);
