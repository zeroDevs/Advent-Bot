const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const btoa = require("btoa");
const fetch = require("node-fetch");
const requestN = require("request");
const { URLSearchParams } = require("url");

const { catchAsync } = require("../utils");
const { estDay, estTime } = require("../utils/date.utils");
const { submissionWebhook, errorWebhook } = require("../../web/utils/webhook");

//tokens
const tokens = require("../../configs/tokens.json");

const User = require("../models/User.model");
const Solution = require("../models/Solution.model");

const StatsService = require("../services/Stats.service");
const SolutionsService = require("../services/Solutions.service");

//     WEBHOOK EXAMPLES
//        submissionWebhook({
//            username: "Matt",
//            url: "https://1111.com",
//            day: 6,
//            thumb: "https://cdn.discord.com/embed/avatars/0.png",
//            lang: "Javascript",
//            time: estDate()
//        });

//        errorWebhook({
//            errorTitle: "INVALID DATE",
//            errorDesc: "BLAH BLAH BLH BLAH"
//        });

router.get("/login", (req, res) => {
    const location = req.query.location ? req.query.location : "/";
    const baseURL = "https://discord.com/api/oauth2/authorize?client_id=";
    const scope = "&scope=identify%20guilds&response_type=code&redirect_uri=";
    res.redirect(`${baseURL}${tokens.CLIENT_ID}${scope}${tokens.redirect}?location=${location}`);
});

router.get(
    "/discord/callback",
    catchAsync(async (req, res) => {
        const location = req.query.location;
        if (!req.query.code) throw new Error("NoCodeProvided");
        const code = req.query.code;

        const bodyData = new URLSearchParams();
        bodyData.append('client_id', tokens.CLIENT_ID);
        bodyData.append('client_secret', tokens.CLIENT_SECRET);
        bodyData.append('grant_type', 'authorization_code');
        bodyData.append('redirect_uri', `${tokens.redirect}?location=${location}`);
        bodyData.append('scope', 'identify guilds');
        bodyData.append('code', code);

        const userToken = await fetch('https://discordapp.com/api/oauth2/token', {
            method: 'POST',
            body: bodyData,
        });


        const tokenJson = await userToken.json();
        //user profile
        const userProfile = await fetch(`http://discord.com/api/users/@me`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tokenJson.access_token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const userGuilds = await fetch(`http://discord.com/api/users/@me/guilds`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tokenJson.access_token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(guilds => checkGuilds(guilds.json()));

        const profileJson = await userProfile.json();
        //const guildsJson = await userGuilds.json();
        console.log("Profile Json", profileJson);

        const avatar =
            profileJson.avatar !== null
                ? `https://cdn.discordapp.com/avatars/${profileJson.id}/${profileJson.avatar}.png?size=1024`
                : `https://robohash.org/${profileJson.username}?set=set2`;

        //let guildCheck = checkGuilds(guildsJson);

        //save user if doesn't exist
        User.findOne({ userid: profileJson.id.toString() }, (err, user) => {
            if (err) console.error(err);
            if (!user) {
                User.create({
                    username: profileJson.username,
                    userid: profileJson.id.toString(),
                    avatarUrl: avatar,
                    point: 0,
                    badgePoint: 0,
                    isZTM: false,
                    langArray: []
                });
            } else console.log(userGuilds);
        });

        //TODO: hash discord token with bcrypt
        jwt.sign(
            { userProfile: profileJson, userGuilds: {} },
            tokens.jwtToken,
            { expiresIn: "30d" },
            (err, token) => {
                if (err) throw err;
                res.redirect(`${tokens.redirect_front}${location}?token=${token}`);
            }
        );
    })
);

// router.post("/profile", );

router.post("/submit", verifyToken, (req, res) => {
    const client = req.client_config.client;

    //user point vars
    let localPoint = 0,
        localBadgePoint = 0,
        isTokenValid = false;

    const userData = req.body;
    console.log("UserData:", userData);

    //verify token
    jwt.verify(req.token, tokens.jwtToken, (err, dec) => {
        if (err) console.error("=========================\n", err, "\n=========================");
        return dec == undefined ? (isTokenValid = false) : (isTokenValid = true);
    });

    if (!isTokenValid) {
        errorWebhook({
            errorTitle: "INVALID TOKEN",
            errorDesc: `req.token ${req.token}, tokens.jwtToken ${tokens.jwtToken}`
        });
        console.log("INVALID TOKEN");
        return res.status(400).json({
            error: "Invalid Token! Please login again.",
            isSuccessful: false,
            data: {}
        });
    }

    //extract date from request
    // convert epoch to human-readable form
    let submittedDate = userData.date;

    if (submittedDate > estDay()) {
        console.log("INVALID DATE", submittedDate, submittedDate, estDay());

        //send webhook if failed
        requestN.post({
            headers: { "content-type": "application/json" },
            url: tokens.log_webhook,
            body: {
                username: "Logger",
                avatar_url:
                    "https://purepng.com/public/uploads/large/purepng.com-robotrobotprogrammableautomatonelectronicscyborg-1701528371687rcmuo.png",
                content: "**Date Error**",
                embeds: [
                    {
                        title: `Username: ${userData.userName} \n UserId: ${userData.userId}`,
                        color: "14177041",
                        description: `UrlSubmitted: ${userData.url
                            } \n Est: ${estDay()} :: SubDay: ${submittedDate}`
                    }
                ]
            },
            json: true
        });

        res.status(400).json({
            error: "Invalid date",
            isSuccessful: false,
            data: {}
        });
        return;
    }

    //data required -> username(with discriminator), id, url, date, langName and a token(for user verification)

    //check if user exist
    User.findOne({ userid: userData.userId.toString() }, (err, userFound) => {
        if (err) {
            errorWebhook({
                errorTitle: "check if user exist",
                errorDesc: err
            });
            console.error("FIND USER ERROR:", error);
        }
        if (!userFound) {
            //obsolete but dont delete
            localPoint = 0;
            localBadgePoint = 0;
            User.create({
                username: userData.userName,
                userid: userData.userId.toString(),
                avatarUrl: userData.avatarUrl,
                point: localPoint,
                badgePoint: localBadgePoint,
                langArray: []
            });
        }
        //check if url already exist
        Solution.findOne({ url: userData.url }, (err, urlExist) => {
            if (err) {
                errorWebhook({
                    errorTitle: "check if url already exist",
                    errorDesc: err
                });
            }

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
                        dayNumber: submittedDate,
                        userid: userData.userId.toString()
                    },
                    (err, sol) => {
                        if (err) console.error(err);

                        if (sol) {
                            if (sol.length > 0) {
                                console.log(sol.length);
                                for (let i = 0; i < sol.length; i++) {
                                    if (userData.langName === sol[i].langName) {
                                        errorWebhook({
                                            errorTitle: "URL EXISTS",
                                            errorDesc: `${userData.userName} tried to submit a solution for day ${submittedDate} in ${userData.langName} that has already been submitted.`
                                        });
                                        console.error(
                                            `Solution for day ${submittedDate} in ${userData.langName} is already submitted.`
                                        );
                                        res.status(400).json({
                                            error: `Solution for day ${submittedDate} in ${userData.langName} is already submitted.`,
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
                                if (submittedDate == estDay()) {
                                    //today's solution --> point+2
                                    localPoint = 2;
                                } else if (submittedDate < estDay()) {
                                    //previous day's solution
                                    localPoint = 1;
                                }
                            }
                        }

                        //add solution to db
                        Solution.create(
                            {
                                url: userData.url,
                                dayNumber: submittedDate,
                                userName: userData.userName,
                                userid: userData.userId.toString(),
                                avatarUrl: userData.avatarUrl,
                                langName: userData.langName,
                                Time: estTime()
                            },
                            async (err, done) => {
                                if (err) {
                                    errorWebhook({
                                        errorTitle: "Adding Solution To Database",
                                        errorDesc: err
                                    });
                                }
                                if (done) {
                                    const stats = await StatsService.getStats();
                                    const recent = await SolutionsService.getRecentSolutions(6);
                                    const rSols = [];
                                    await recent.map(r =>
                                        rSols.push({ name: r.userName, url: r.url })
                                    );
                                    client.updateAdventEmbed({
                                        stats: [
                                            stats.totalSolutions,
                                            stats.todaysSolutions,
                                            stats.totalUsers
                                        ],
                                        recent: rSols
                                    });

                                    // Create a embed in #submissions
                                    submissionWebhook({
                                        username: userData.userName,
                                        url: userData.url,
                                        day: submittedDate,
                                        thumb: userData.avatarUrl,
                                        lang: userData.langName,
                                        time: estTime()
                                    });
                                }
                            }
                        );

                        //update user points
                        User.findOneAndUpdate(
                            { userid: userData.userId.toString() },
                            {
                                $inc: {
                                    point: localPoint,
                                    badgePoint: localBadgePoint
                                }
                            },
                            { upsert: true },
                            (err, doc) => {
                                if (err) {
                                    errorWebhook({
                                        errorTitle: "Updating User Points",
                                        errorDesc: err
                                    });
                                }
                                return res.status(200).json({
                                    error: null,
                                    isSuccessful: true,
                                    data: {}
                                });
                            }
                        );

                        //add language used to array in user model
                        User.findOne({ userid: userData.userId.toString() }, (err, user) => {
                            if (err) {
                                errorWebhook({
                                    errorTitle: "add language used to array in user model",
                                    errorDesc: err
                                });
                            }
                            if (user) {
                                console.log("FINDONE USER:", user);
                                if (user.langArray.includes(userData.langName.toLowerCase())) {
                                    console.log(userData.langName.toLowerCase());
                                    return;
                                } else {
                                    user.langArray.push(userData.langName.toLowerCase());
                                    console.log(user.langArray);
                                    User.findOneAndUpdate(
                                        { userid: userData.userId.toString() },
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

const checkGuilds = guildArray => {
    for (let i = 0; i < guildArray.length; i++) {
        if (guildArray[i].id === tokens.serverid) {
            return true;
        }
    }
    return false;
};

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

webhook = ({ type, username, userImg, url, day, errorTitle, errorDesc }) => {
    data = {};
    // Sends a webhook to the submission channel
    if (type === "submitted") {
        data = {
            url: tokens.successWebhook,
            title: "New AoC Submission!",
            desc: `Checkout **${username}'s** [submission](${url}) for day ${day}`,
            color: 8392720,
            field: [],
            thumb: userImg
        };
    }

    // Sends a webhook to the dev channel
    if (type === "error") {
        data = {
            url: tokens.errorWebhook,
            title: "An Error was detected",
            desc: `${errorTitle}\n\`\`\` ${errorDesc.slice(0, 1023)} \`\`\` `,
            color: 16740352,
            field: [],
            thumb: ""
        };
    }

    sendWebhook({ data });
};

module.exports = router;
