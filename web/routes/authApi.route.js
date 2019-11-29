const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const btoa = require("btoa");
const fetch = require("node-fetch");

const { catchAsync } = require("../utils");
const { estDay, estTime } = require("../utils/date.utils");
const tokens = require("../../configs/tokens.json");
const User = require("../models/User.model");
const Solution = require("../models/Solution.model");

const StatsService = require("../services/Stats.service");
const SolutionsService = require("../services/Solutions.service");

router.get("/login", (req, res) => {
    const location = req.query.location ? req.query.location : "/";
    const baseURL = "https://discordapp.com/api/oauth2/authorize?client_id=";
    const scope = "&scope=identify%20guilds&response_type=code&redirect_uri=";
    res.redirect(`${baseURL}${tokens.CLIENT_ID}${scope}${tokens.redirect}?location=${location}`);
});

router.get(
    "/discord/callback",
    catchAsync(async (req, res) => {
        const location = req.query.location;
        if (!req.query.code) throw new Error("NoCodeProvided");
        const code = req.query.code;
        const creds = btoa(`${tokens.CLIENT_ID}:${tokens.CLIENT_SECRET}`);
        const userToken = await fetch(
            `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&scope=identify%20guilds&code=${code}&redirect_uri=${tokens.redirect}?location=${location}`,
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
              Authorization: `Bearer ${tokenJson.access_token}`,
              "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const userGuilds = await fetch(`http://discordapp.com/api/users/@me/guilds`, {
        	method: "POST",
        	headers: {
            Authorization: `Bearer ${tokenJson.access_token}`,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });

        const profileJson = await userProfile.json();
        const guildsJson = await userGuilds.json();
        console.log(profileJson);

        const avatar = profileJson.avatar !== null
					? `https://cdn.discordapp.com/avatars/${profileJson.id}/${profileJson.avatar}.png?size=1024`
					: `https://robohash.org/${profileJson.username}?set=set2`;

				let guildCheck = checkGuilds(guildsJson);

        //save user if doesn't exist
        User.findOne({ userid: profileJson.id }, (err, user) => {
            if (err) console.error(err);
            if (!user) {
            	User.create({
                username: profileJson.username,
                userid: profileJson.id,
                avatarUrl: avatar,
                point: 0,
                badgePoint: 0,
                isZTM: guildCheck,
                langArray: []
	            });
            }
        });

        //TODO: hash discord token with bcrypt
        jwt.sign(
            { userProfile: profileJson, userGuilds: guildsJson },
            tokens.jwtToken,
            { expiresIn: "7d" },
            (err, token) => {
                if (err) throw err;
                res.redirect(`${tokens.redirect_front}${location}?token=${token}`);
            }
        );
    })
);

// router.post("/profile", );

router.post("/submit", verifyToken, (req, res) => {
    const client = req.client_config;

    //user point vars
    let localPoint = 0,
        localBadgePoint = 0,
        isTokenValid = false;

    const userData = req.body;
    console.log("UD:", userData);

    //verify token
    jwt.verify(req.token, tokens.jwtToken, (err, dec) => {
        if (err) console.error("=========================\n", err, "\n=========================");
        return dec == undefined ? (isTokenValid = false) : (isTokenValid = true);
    });

    if (!isTokenValid) {
        console.log("INVALID TOKEN");
        return res.status(400).json({
            error: "Invalid Token",
            isSuccessful: false,
            data: {}
        });
    }

    //extract date from request
    // convert epoch to human-readable form
    let submittedDate = new Date(userData.date);
    console.log(typeof submittedDate);

    if (
        submittedDate.getDate() > estDay() ||
        submittedDate.getMonth() + 1 != 12 ||
        submittedDate.getFullYear() != 2019
    ) {
        console.log("INVALID DATE");
        res.status(400).json({
            error: "Invalid date",
            isSuccessful: false,
            data: {}
        });
        return;
    }

    //data required -> username(with discriminator), id, url, date, langName and a token(for user verification)

    //check if user exist
    User.findOne({ userid: userData.userId }, (err, userFound) => {
        if (err) {
            console.error("FIND USER ERROR:", error);
        }
        if (!userFound) {
        	//obsolete but dont delete 
            localPoint = 0;
            localBadgePoint = 0;
            User.create({
                username: userData.userName,
                userid: userData.userId,
                avatarUrl: userData.avatarUrl,
                point: localPoint,
                badgePoint: localBadgePoint,
                langArray: []
            });
        }
        //check if url already exist
        Solution.findOne({ url: userData.url }, (err, urlExist) => {
            if (err) console.error(err);

            if (urlExist) {
                res.status(400).json({
                    error: "URL already exist",
                    isSuccessful: false,
                    data: {}
                });
                return;
            } else {
                Solution.find(
                    {
                        dayNumber: submittedDate.getDate(),
                        userid: userData.userId
                    },
                    (err, sol) => {
                        if (err) console.error(err);

                        if (sol) {
                            if (sol.length > 0) {
                                console.log(sol.length);
                                for (let i = 0; i < sol.length; i++) {
                                    if (userData.langName === sol[i].langName) {
                                        console.error(
                                            `Solution for day ${submittedDate.getDate()} in ${
                                                userData.langName
                                            } is already submitted.`
                                        );
                                        res.status(400).json({
                                            error: `Solution for day ${submittedDate.getDate()} in ${
                                                userData.langName
                                            } is already submitted.`,
                                            isSuccessful: false,
                                            data: {}
                                        });
                                        return;
                                    }
                                }

                                //user has already submitted solution for this day --> badgePoint++
                                localBadgePoint = 1;
                            } else {
                                //user hasn't submitted this day's solution
                                if (submittedDate.getDate() == estDay()) {
                                    //today's solution --> point+2
                                    localPoint = 2;
                                } else if (submittedDate.getDate() < estDay()) {
                                    //previous day's solution
                                    localPoint = 1;
                                }
                            }
                        }

                        //add solution to db
                        Solution.create(
                            {
                                url: userData.url,
                                dayNumber: submittedDate.getDate(),
                                userName: userData.userName,
                                userid: userData.userId,
                                avatarUrl: userData.avatarUrl,
                                langName: userData.langName,
                                Time: estTime()
                            },
                            (err, done) => {
                                if (err) console.error(err);
                                if (done) {
                                    const stats = StatsService.getStats();
                                    const recent = SolutionsService.getRecent(5);
                                    const rSols = [];
                                    recent.map(r => rSols.push({ name: r.userName, url: r.url }));
                                    client.updateAdventEmbed({
                                        stats: [
                                            stats.totalSolutions,
                                            stats.todaysSolutions,
                                            stats.totalUsers
                                        ],
                                        recent: rsols
                                    });
                                }
                            }
                        );

                        //update user points
                        User.findOneAndUpdate(
                            { userid: userData.userId },
                            {
                                $inc: {
                                    point: localPoint,
                                    badgePoint: localBadgePoint
                                }
                            },
                            { upsert: true },
                            (err, doc) => {
                                if (err) console.error(err);
                                return res.status(200).json({
                                    error: null,
                                    isSuccessful: true,
                                    data: {}
                                });
                            }
                        );

                        //add language used to array in user model
                        User.findOne({ userid: userData.userId }, (err, user) => {
                            if (err) console.error(err);
                            if (user) {
                                console.log("FINDONE USER:", user);
                                if (user.langArray.includes(userData.langName.toLowerCase())) {
                                    console.log(userData.langName.toLowerCase());
                                    return;
                                } else {
                                    user.langArray.push(userData.langName.toLowerCase());
                                    console.log(user.langArray);
                                    User.findOneAndUpdate(
                                        { userid: userData.userId },
                                        {
                                            langArray: user.langArray
                                        },
                                        { upsert: true },
                                        (err, done) => {
                                            if (err) console.error(err);
                                            return;
                                        }
                                    );
                                }
                            }
                        });
                    }
                );
            }
        });
    });
});

const checkGuilds = (guildArray) => {
	for(let i=0; i<guildArray.length; i++) {
		if(guildArray[i].id === tokens.serverid) {
			return true;
		}
	}
	return false;
}

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

module.exports = router;
