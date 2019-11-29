const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 8001;
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const tokens = require("../configs/tokens.json");

const indexRoute = require("./routes/index.route");
const apiRoute = require("./routes/authApi.route");
const solutionsRoute = require("./routes/solutions.route");
const usersRoute = require("./routes/users.route");
const statsRoute = require("./routes/stats.route");
// const authRoute = require("../routes/auth.route") // Future implementation

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

module.exports = client => {
    mongoose
        .connect(`${tokens.mongo}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log("Connected to the database"));
    app.use(cors());
    app.use("/", indexRoute);
    app.use(
        "/api",
        function(req, res, next) {
            req.client_config = {
                client: client
            };
            next();
        },
        apiRoute
    );
    app.use("/solutions", solutionsRoute);
    app.use("/users", usersRoute);
    app.use("/stats", statsRoute);

    app.listen(port, function() {
        console.log("Advent - Webserver is running on port:", port);
    });
};
