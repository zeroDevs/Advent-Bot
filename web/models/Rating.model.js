const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

module.exports = (options) => {

    const year = options.year ? options.year : moment().format('YYYY')

    const RatingSchema = new Schema(
        {
            solutionId: { type: ObjectId, ref: "Solution" },
            userId: { type: Number, ref: "User" },
            ratingScore: Number
        },
        { timestamps: true }
    );

    const yearDB = mongoose.connection.useDb(`AOC-${year}`);

    return yearDB.model("Rating", RatingSchema);

}