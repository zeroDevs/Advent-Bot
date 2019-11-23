const Solution = require("../models/Solution.model");

class SolutionsController {
    constructor(logger) {
        this.logger = logger; // not in use yet, implement
    }

    async urlInUse(url) {
        try {
            const solution = await Solution.findOne({ url }).exec();
            return Boolean(solution);
        } catch (error) {
            // this.logger.error(`*urlInUse*: ${error}`);
        }
    }

    async langsUsedForDay(userid, day) {
        try {
            const data = await Solution.find({ userid, dayNumber: day }).exec();
            return (data && data.map(solution => solution.langName)) || [];
        } catch (error) {
            // this.logger.error(`*langsUsedForDay*: ${error}`);
            return [];
        }
    }

    async createSolution(solution) {
        try {
            const newSolution = new Solution({ ...solution });
            newSolution.save();
            return true;
        } catch (error) {
            // this.logger.error(`*createSolution*: ${error}`);
        }
    }

    async deleteSolution(solutionId) {
        try {
            await Solution.findByIdAndDelete(solutionId).exec();
            return true;
        } catch (error) {
            // this.logger.error(`*deleteSolution*: ${error}`);
        }
    }
}

module.exports = SolutionsController;
