const dateUtils = require("../utils/date.utils");
const SolutionsService = require("../services/Solutions.service");
const UsersService = require("../services/Users.service");

class StatsService {
    constructor(logger) {
        // this.logger = logger; // switch to use real logger
        this.logger = console;
    }

    async getStats() {
        try {
            const dayNumber = dateUtils.estDay();
            const totalSolutions = await SolutionsService.getAllSolutions();
            const todaysSolutions = await SolutionsService.getSolutionsForDay(dayNumber);
            const totalUsers = await UsersService.activeUsers();
            const authedUsers = await UsersService.allUsers();
            const langStats = {
                Javascript: 0,
                Python: 0,
                "C#": 0,
                Java: 0,
                Go: 0,
                Other: 0,
                "C++": 0,
                PHP: 0,
                Ruby: 0
            };
            totalSolutions.map(sol => {
                langStats[sol.langName]++;
            });
            return {
                totalSolutions: totalSolutions.length,
                todaysSolutions: todaysSolutions.length,
                totalUsers: totalUsers.length,
                authedUsers: authedUsers.length,
                langStats: langStats
            };
        } catch (error) {
            this.logger.error(`*getStats*: ${error}`);
        }
    }
}

module.exports = new StatsService();
