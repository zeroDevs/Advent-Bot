const route = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const tokens = require("../../configs/tokens.json");

/**
 * This is the solutions routes. Here we can can request solutions from the database
 * Providing a query param such as ?day=5 Will return only the solutions from day 5
 * Providing no query param will result in all solutions
 **/

route.get("/", (req, res) => {
    MongoClient.connect(tokens.mongo, { useNewUrlParser: true }, function(
        err,
        db
    ) {
        if (err) throw err;
        var dbo = db.db("AOC");
        dbo.collection("users")
            .find({langArray: {$exists: true, $not: {$size: 0}}})
            .toArray(function(err, result) {
                if (err) throw err;
                res.json(result);
                db.close();
            });
    });
});

module.exports = route;
