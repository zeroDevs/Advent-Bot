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
                endpoint: "solutions",
                desc:
                    "Returns all solutions when called. Append a `day` param to reqest solutions for a particular day. Eg. `/solutions?day=6`"
            },
            {
                method: "GET",
                endpoint: "users",
                desc: "Returns all users, containing points and badgePoints. "
            },
            {
                method: "GET",
                endpoint: "api/login/",
                desc: "This is the route used for Discord OAuth"
            },
            {
                method: "POST",
                endpoint: "api/submit/",
                desc:
                    "This is the endpoint used to submit a solution. It will verify if user is unique and if the user is authed."
            }
        ]
    });
});

module.exports = route;
