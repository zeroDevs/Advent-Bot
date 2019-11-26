const route = require("express").Router();
const dateUtils = require("../utils/date.utils");
const SolutionsService = require("../services/Solutions.service");
const UsersService = require("../services/Users.service");

route.get("/", async (req, res) => {
    const dayNumber = dateUtils.estDay();
    const totalSolutions = await SolutionsService.getAllSolutions();
    const todaysSolutions = await SolutionsService.getSolutionsForDay(dayNumber);
    const totalUsers = await UsersService.allUsers();

    res.send({
        totalSolutions: totalSolutions.length,
        todaysSolutions: todaysSolutions.length,
        totalUsers: totalUsers.length
    });
});

module.exports = route;
