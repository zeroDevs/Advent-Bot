const Rating = require("../models/Rating.model");

class RatingsService {
    constructor(logger) {
        // this.logger = logger; // switch to use real logger
        this.logger = console;
    }

    async getRating(ratingId) {
        try {
            const data = await Rating.findById(ratingId).exec();
            return data;
        } catch (error) {
            this.logger.error(`*getRating*: ${error}`);
        }
    }

    async getRatingsForUser(userId) {
        try {
            const ratings = await Rating.find({ userId }).exec();
            return ratings;
        } catch (error) {
            this.logger.error(`*getRatingsForUser*: ${error}`);
        }
    }

    async getAllRatings() {
        try {
            const data = await Rating.find().exec();
            return data;
        } catch (error) {
            this.logger.error(`*getAllRatings*: ${error}`);
        }
    }

    async getRatingsForSolution(solutionId) {
        try {
            const ratings = await Rating.find({ solutionId }).exec();
            return ratings;
        } catch (error) {
            this.logger.error(`*getRatingsForSolution*: ${error}`);
        }
    }

    async createNewRating(rating) {
        try {
            const newRating = new Rating({ ...rating });
            newRating.save();
            return true;
        } catch (error) {
            console.error(`*createNewRating*: ${error}`);
        }
    }

    async deleteRating(ratingId) {
        try {
            await Rating.findByIdAndDelete({ _id: ratingId }).exec();
        } catch (error) {
            this.logger.error(`*deleteRating*: ${error}`);
        }
    }

    async updateRating(userId, solutionId, rating) {
        try {
            await Rating.findOneAndUpdate({ userId, solutionId }, { ...rating }).exec();
            return true;
        } catch (error) {
            this.logger.error(`*updateRating*: ${error}`);
        }
    }

    calculateAverage(ratings) {
        try {
            const sum = ratings.reduce((total, rating) => total + rating.ratingScore, 0);
            const count = ratings.length;
            return sum / count;
        } catch (error) {
            this.logger.error(`*calculateAverage*: ${error}`);
        }
    }

    async hasUserVotedOnSolution(solutionId, userId) {
        try {
            const rating = await Rating.find({
                solutionId,
                userId
            }).exec();
            return Boolean(rating && rating.length > 0);
        } catch (error) {
            this.logger.error(`*hasUserVotedOnSolution*: ${error}`);
        }
    }

    isOwnRating(rating, userId) {
        return String(rating.userId) === String(userId);
    }
}

module.exports = new RatingsService();
