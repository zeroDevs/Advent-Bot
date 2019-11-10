const express = require('express');
const app = express();
const port = 8001;
const MongoClient = require('mongodb').MongoClient;

const apiRoute = require('./authApi.js');

const db_name = "AOC";

module.exports = (client) => {
    console.log(client.settings.mongo)
    app.listen(port, function () {
        console.log('Advent - Webserver is running on port:', port);
    });

    app.use('/api', apiRoute);

    app.get('/data', function (req, res) {
        res.sendFile(__dirname + "/advent/adventData.json");
    })

    app.get('/solutions', function (req, res) {
        console.log(req.query.day);

        MongoClient.connect(client.settings.mongo, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection("snippets").find({ dayNumber: req.query.day }).toArray(function (err, result) {
                if (err) throw err;
                res.json(result);
                db.close();
            });
        });
    });

    app.get('/solutions/all', function (req, res) {

        MongoClient.connect(client.settings.mongo, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection("snippets").find({}).toArray(function (err, result) {
                if (err) throw err;
                res.json(result);
                db.close();
            });
        });
    });

    //route for student list
    app.get('/user', (req, res) => {
        MongoClient.connect(client.settings.mongo, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection("users").find({}).toArray(function (err, result) {
                if (err) throw err;
                res.json(result);
                db.close();
            });
        });
    });


}
