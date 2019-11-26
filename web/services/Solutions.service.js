const Solution = require("../models/Solution.model");

class SolutionsService {
    constructor(logger) {
        // this.logger = logger; // switch to use real logger
        this.logger = console;
    }

    async urlInUse(url) {
        try {
            const solution = await Solution.findOne({ url }).exec();
            return Boolean(solution && solution.length > 0);
        } catch (error) {
            this.logger.error(`*urlInUse*: ${error}`);
        }
    }

    async getAllSolutions() {
        try {
            const data = await Solution.find().exec();
            return data;
        } catch (error) {
            this.logger.error(`*getAllSolutions*: ${error}`);
        }
    }

    async getSolutionsForDay(dayNumber) {
        try {
            const data = await Solution.find({ dayNumber }).exec();
            return data;
        } catch (error) {
            this.logger.error(`*getSolutionsForDay*: ${error}`);
        }
    }

    async langsUsedForDay(userid, dayNumber) {
        try {
            const data = await Solution.find({ userid, dayNumber }).exec();
            return (data && data.map(solution => solution.langName)) || [];
        } catch (error) {
            this.logger.error(`*langsUsedForDay*: ${error}`);
            return [];
        }
    }

    async createSolution(solution) {
        try {
            const newSolution = new Solution({ ...solution });
            newSolution.save();
            return true;
        } catch (error) {
            this.logger.error(`*createSolution*: ${error}`);
        }
    }

    async deleteSolution(solutionId) {
        try {
            await Solution.findByIdAndDelete(solutionId).exec();
            return true;
        } catch (error) {
            this.logger.error(`*deleteSolution*: ${error}`);
        }
    }
}

module.exports = new SolutionsService();
