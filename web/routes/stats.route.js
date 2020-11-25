const route = require("express").Router();
const StatsService = require("../services/Stats.service");

route.get("/", async (req, res) => {
    const stats = await StatsService.getStats(req.query.year);

    res.send(stats);
});

module.exports = route;
