const route = require("express").Router();
const solutionHandler = require("../database/solutions.database");
const userHandler = require("../database/user.database");

route.get("/", (req, res) => {
    res.send("Stats Endpoint");
});

module.exports = route;
