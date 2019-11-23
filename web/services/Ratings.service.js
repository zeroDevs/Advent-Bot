const Solution = require("../models/Solution.model");
const User = require("../models/User.model");

class RatingsService {
    constructor(logger) {
        this.logger = logger;
    }

    async createNewRating() {}

    async updateRating() {}

    async calculateAverage() {}

    async hasUserVotedOnSolution() {}
}

module.exports = RatingsService;
