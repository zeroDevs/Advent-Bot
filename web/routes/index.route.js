const route = require("express").Router();

/**
 * This is the base(`/`) route. It will provide the documentation for the endpoints
 * To add a new endpoint, simple add a new object to the array.
 **/

route.get("/", (req, res) => {
    res.render("index.ejs", {
        ip: `https://aocbot.zerobot.xyz`,
        endpoints: [
            {
                method: "GET",
                endpoint: "api/login",
                desc: "This endpoint will redirect the user to Discords authentication service`"
            },
            {
                method: "GET",
                endpoint: "api/discord/callback",
                desc: "This endpoint will be used to convert the token return from discords auth. "
            },
            {
                method: "POST",
                endpoint: "api/submit",
                desc: "This endpoint is used to submit a submission and store it in the database."
            },
            {
                method: "GET",
                endpoint: "solutions",
                desc:
                    "Returns all solutions when called. Append a `day` param to reqest solutions for a particular day. Eg. `/solutions?day=6`"
            },
            {
                method: "POST",
                endpoint: "solutions/vote",
                desc: "This endpoint is used to create a vote on a submission."
            },
            {
                method: "DELETE",
                endpoint: "solutions/vote/:solutionId",
                desc: "Deletes the users vote"
            },
            {
                method: "GET",
                endpoint: "solutions/recent",
                desc:
                    "By default will return the 6 most recent solutions. Append a `qty` param to reqest more. Eg. `/solutions/recent?qty=9`"
            },
            {
                method: "GET",
                endpoint: "solutions/top",
                desc:
                    "By default will return the 6 most popular solutions. Append a `qty` param to reqest more. Eg. `/solutions/top?qty=9`"
            },
            {
                method: "GET",
                endpoint: "users",
                desc: "Returns all user collections. "
            },
            {
                method: "GET",
                endpoint: "stats",
                desc: "This provides an object of statistics, including total submissions and users"
            }
        ]
    });
});

module.exports = route;
