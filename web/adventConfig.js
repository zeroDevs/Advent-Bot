const express = require("express");
const app = express();
const port = 8001;
const bodyParser = require("body-parser");
const cors = require("cors");

const indexRoute = require("../routes/index.route");
const apiRoute = require("./authApi.js");
const solutionsRoute = require("../routes/solutions.route");
const usersRoute = require("../routes/users.route");
const statsRoute = require("../routes/stats.route");
// const authRoute = require("../routes/auth.route") // Future implementation

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

module.exports = client => {
    app.listen(port, function() {
        console.log("Advent - Webserver is running on port:", port);
    });

    app.use(cors());
    app.use("/", indexRoute);
    app.use("/api", apiRoute);
    app.use("/solutions", solutionsRoute);
    app.use("/users", usersRoute);
    app.use("/stats", statsRoute);
    // app.use("/auth", authRoute ) // Future Implementation
};
