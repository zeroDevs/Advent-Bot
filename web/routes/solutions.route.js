const route = require("express").Router();

const SolutionsService = require("../services/Solutions.service");
const RatingsService = require("../services/Ratings.service");

/**
 * This is the solutions routes. Here we can can request solutions from the database
 * Providing a query param such as ?day=5 Will return only the solutions from day 5
 * Providing no query param will result in all solutions
 **/

route.get("/", async (req, res) => {
    const { day } = req.query;

    const solutions = day
        ? await SolutionsService.getSolutionsForDay(day)
        : await SolutionsService.getAllSolutions();

    const ratings = await RatingsService.getAllRatings();

    const data = solutions.map(solution => {
        const temp = { ...solution._doc };
        temp.ratings = ratings.filter(rating => String(rating._doc.solutionId) == String(temp._id));
        temp.averageRating = RatingsService.calculateAverage(temp.ratings);
        return temp;
    });

    if (data) return res.status(200).json(data);

    return res.sendStatus(500);
});

route.post("/", async (req, res) => {
    const { ...solution } = req.body;

    await SolutionsService.createSolution({ ...solution });

    res.sendStatus(201);
});

/***
 * @description Creates a new rating for the solution
 *
 * @body {
 *      ratingScore: Number;
 *      solutionId: MongoDb ObjectId;
 *      userId: MongoDb ObjectId
 * }
 */

// add middleware so only logged in users can vote
route.post("/vote", async (req, res) => {
    const { ...rating } = req.body;

    if (await RatingsService.hasUserVotedOnSolution(rating.solutionId, rating.userId)) {
        return res.sendStatus(400);
    }

    if (await RatingsService.createNewRating({ ...rating })) {
        return res.sendStatus(201);
    }
    return res.sendStatus(400);
});

module.exports = route;