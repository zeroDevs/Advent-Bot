const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const RatingSchema = new Schema(
    {
        solutionId: { type: ObjectId, ref: "Solution" },
        userId: { type: Number, ref: "User" },
        ratingScore: Number
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rating", RatingSchema);
