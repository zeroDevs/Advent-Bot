const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const btoa = require("btoa");
const fetch = require("node-fetch");

const { catchAsync } = require("./utils");
const tokens = require("../configs/tokens.json");

//mongoose setup
mongoose.connect(`${tokens.mongo}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let solSchema = new mongoose.Schema({
    url: String,
    dayNumber: Number,
    userName: String,
    userid: Number,
    language: String,
    avatarUrl: String,
    Time: { type: Date, default: Date.now }
});

let userSchema = new mongoose.Schema({
    username: String, //username format -> username#discrimanator
    userid: Number,
    point: Number,
    badgePoint: Number,
    avatarUrl: String
});

//snippet model
const Snippet = mongoose.model("Snippet", solSchema);
//user model
let User = mongoose.model("User", userSchema);

router.get("/login", (req, res) => {
    const location = req.query.location;
    res.redirect(
        `https://discordapp.com/api/oauth2/authorize?client_id=${
            tokens.CLIENT_ID
        }&scope=identify%20guilds&response_type=code&redirect_uri=${
            tokens.redirect
        }?location=${location ? location : "/"}`
    );
});

router.get(
    "/discord/callback",
    catchAsync(async (req, res) => {
        const location = req.query.location;
        if (!req.query.code) throw new Error("NoCodeProvided");
        const code = req.query.code;
        const creds = btoa(`${tokens.CLIENT_ID}:${tokens.CLIENT_SECRET}`);
        const response = await fetch(
            `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&scope=identify%20guilds&code=${code}&redirect_uri=${tokens.redirect}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Basic ${creds}`,
                    "Content-Type": "application/json"
                }
            }
        );
        const tokenJson = await userToken.json();
        //user profile
        const userProfile = await fetch(`http://discordapp.com/api/users/@me`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${json.access_token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const profileJson = await userProfile.json();
        console.log(profileJson);

        jwt.sign(
            { userProfile: profileJson },
            "y3l10whulk",
            { expiresIn: "2d" },
            (err, token) => {
                if (err) throw err;
                res.redirect(
                    `${tokens.redirect_front}/?token=${token}&location=${location}`
                );
            }
        );
    })
);

// router.post("/profile", );

router.post("/submit", (req, res) => {
    //user point vars
    let point, badgePoint;

    const userData = req.body;

    //data required -> username(with discriminator), userid, url, date

    //check if user exist
    User.findOne({ username: userData.name }, (err, userFound) => {
        if (err) {
            console.log(error);
        }
        if (!userFound) {
            point = 0;
            badgePoint = 0;
            User.create({ username, userid, point, badgePoint });
        }
        if (userFound) {
            //check if url already exist
            Snippet.findOne({ url: userData.url }, (err, urlExist) => {
                if (err) console.log(err);

                console.log(urlExist);
                if (urlExist) {
                    res.status(400).json({
                        error: "URL already exist",
                        isSuccessful: false,
                        data: {}
                    });
                } else {
                    //add more stuff
                }
            });
        }
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.replace(/^JWT\s/, ``).split(" ");
        const bearerToken = bearer[1].replace(/^"(.*)"$/, "$1");
        req.token = bearerToken;
        next();
    } else {
        res.status(403).json({ error: "token error", isSuccessful: false });
    }
}

module.exports = router;
