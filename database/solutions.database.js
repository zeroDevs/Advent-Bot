const Solutions = require("./solutions.model");
const solutionsHandler = {};

// Checks if the URL already exists
solutionsHandler.checkUrl = url => {
    Solutions.findOne({ url: url }, (err, urlExist) => {
        if (err) console.error("FIND USER ERROR:", error);
        console.log(urlExist);
    });
};

// Returns the users languages for a given day
solutionsHandler.solutionLangs = (user, day) => {};

// Add a solution to the database
solutionsHandler.createSolution = () => {};

// Remove solution - FUTURE IMPLEMENTATION
solutionsHandler.delete = () => {};

module.exports = solutionsHandler;
