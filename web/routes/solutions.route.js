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
        ? await SolutionsService.getSolutionsForDay(day, req.query.year)
        : await SolutionsService.getAllSolutions(req.query.year);

    // const ratings = await RatingsService.getAllRatings(req.query.year);

    // const data = solutions.map(solution => {
    //     const temp = { ...solution._doc };
    //     temp.ratings = ratings.filter(rating => String(rating._doc.solutionId) == String(temp._id));
    //     return temp;
    // });

    data = solutions;

    if (data) return res.status(200).json(data);

    return res.sendStatus(500);
});

// add middleware so only logged in users can vote
route.post("/vote", verifyToken, async (req, res) => {
    const { ...rating } = req.body;
    if (await RatingsService.hasUserVotedOnSolution(rating.solutionId, rating.userId, req.query.year)) {
        return res.status(400).json({ error: "cannot vote twice", isSuccessful: false });
    }
    if (RatingsService.isOwnRating({ ...rating }, rating.userId)) {
        return res
            .status(400)
            .json({ error: "cannot vote your own solution", isSuccessful: false });
    }

    // creates a new rating document, re-calculates the average ratings and updates the solution
    // returns the updated solution
    const updatedSolution = await RatingsService.createNewRating(
        { ...rating },
        SolutionsService.updateSolution
    );
    return res.status(201).json({ updatedSolution, error: "vote successful", isSuccessful: true });
});

// need to add an authentication/authorization middleware to validate user with JWT
route.delete("/vote/:ratingId", async (req, res) => {
    const { ratingId } = req.params;
    const { userId } = req.body;

    const rating = await RatingsService.getRating(ratingId, req.query.year);
    const isOwnRating = RatingsService.isOwnRating(rating, userId);

    if (isOwnRating) {
        await RatingsService.deleteRating(ratingId);
        return res.sendStatus(200);
    }

    return res.sendStatus(400);
});

route.get("/recent/", async (req, res) => {
    const qty = req.query.qty ? req.query.qty : 6;
    const solutions = await SolutionsService.getRecentSolutions(qty, req.query.year);

    if (solutions) return res.status(200).json(solutions);
    return res.sendStatus(500);
});

route.get("/top", async (req, res) => {
    const qty = req.query.qty ? req.query.qty : 6;
    const solutions = await SolutionsService.getTopSolutions(qty, req.query.year);

    if (solutions) return res.status(200).json(solutions);
    return res.sendStatus(500);
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.replace(/^JWT\s/, ``).split(" ");
        const bearerToken = bearer[1].replace(/^"(.*)"$/, "$1");
        req.token = bearerToken;
        next();
    } else {
        res.status(403).json({
            error: "Invalid token",
            isSuccessful: false,
            data: {}
        });
    }
}

module.exports = route;
