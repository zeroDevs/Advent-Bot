const Discord = require("discord.js");
const token = require("../tokens.json")
const mongoose = require('mongoose');

//db starts
//connection to mlab
mongoose.connect(`${token.mlabs}`, { useNewUrlParser: true });

//mlab schema 1
let codeSchema = new mongoose.Schema({
    url: String,
    dayNumber: String,
    userName: String,
    userid: String,
    langName: String,
    avatarUrl: String,
    Time: { type: Date, default: Date.now }
});

const Snippet = mongoose.model('Snippet', codeSchema);

//mlab schema 2
let userSchema = new mongoose.Schema({
    username: String,
    userid: String,
    badgePoint: Number,
    avatarUrl: String,
    point: Number
});

//initializing variables to be saved in db
let username, userid, point, badgePoint;

let User = mongoose.model('User', userSchema);

//db ends

exports.run = async (client, message, args, level, user, reaction) => { // eslint-disable-line no-unused-vars
    // console.log(args, "== ARGS ==")

    // Sub-Command handler
    if (!args[0]) sendMenu(client, message)
    if (args[0] === "submit") submitValidation(client, message, args)
    if (args[0] === "statsInit") {
        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setColor("#238c53")
            .setThumbnail("https://cdn0.iconfinder.com/data/icons/christmas-flat-ten/128/christmas-flat-ten-bulb-512.png")
            .setDescription(`PlaceHolder`)

        message.channel.send({ embed });
    }
};

const ValidURL = (vUrl) => {
    let regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (!regex.test(vUrl)) {
        return false;
    } else {
        if (vUrl.includes("https://")) {
            return true;
        } else {
            return false;
        }
    }
}

const submitValidation = (client, message, args) => {
    // console.log("Command Args: ", args)
    const subErrors = []
    const maxDate = (client.dateEST() > 25 ? 25 : client.dateEST())
    console.log(client.dateEST() >= parseInt(args[1]))
    // if (!args[1] || !(args[1] > 0 && args[1] <= maxDate)) subErrors.push(`You did not enter a valid day number! Must be between 1 - ${maxDate}`)
    // if (!args[2] || !ValidURL(args[2])) subErrors.push("You did not supply a valid url! Make sure you include the https://")
    // if (!args[3]) subErrors.push("You did not enter the language your submission was written in!")
    if (!args[1] || !(args[1] > 0 && args[1] <= 31)) {
        subErrors.push(`You did not enter a valid day number! Must be between 1 - ${maxDate}`)
    } else if (!args[2] || !ValidURL(args[2])) {
        subErrors.push("You did not supply a valid url! Make sure you include the https://")
    } else if (!args[3]) {
        subErrors.push("You did not enter the language your submission was written in!")
    }

    if (subErrors[0]) {
        let errMsg = "The following errors were found:"
        subErrors.forEach(e => {
            errMsg = errMsg + `\n :x: ${e}`
        });
        message.channel.send(errMsg + "\n**Use this format:**\n`+aoc submit <day> <url> <language>`\n**For Example:**\n`+aoc submit 10 https://repl.it/yourlink javascript`")
        console.log("Validation Errors", errMsg)

    } else {
        formatData(client, message, args)
    }
};

const formatData = (client, message, args) => {
    let url = args[2]
    username = message.author.username;

    // Format Languages
    let langName = args[3].toLowerCase();
    if (langName === "js") {
        langName = "javascript";
    } else if (langName.startsWith('py')) {
        langName = "python"
    } else {
        langName = args[3].toLowerCase();
    }

    // Default Avatar

    let avatarUrl;
    if (message.author.avatarURL === null) {
        avatarUrl = "https://robohash.org/" + message.author.username + message.author.id
    } else {
        avatarUrl = message.author.avatarURL;
    }

    // Check if url is in db
    // Yes = Reject solution
    // No = Accept solution
    Snippet.findOne({ url: url }, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            // Exists in DB - Reject it
            message.reply(":copyright: URL already exists");
        } else {
            // Doesn't Exist in DB - Accept it
            let dayNumber = Math.floor(args[1]);
            let userid = message.author.id;
            let userName = message.author.username;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            Snippet.findOne({ userid: message.author.id, dayNumber: dayNumber }, function (err, solFound) {

                if (err) {
                    console.log(err);
                }
                if (solFound) {
                    console.log('sol found')
                    console.log('est date', client.dateEST().toString())
                    console.log('submitted date', dayNumber)
                    console.log(dayNumber === client.dateEST().toString())
                    if(dayNumber === client.dateEST()) {
                        console.log('entered 2')
                        badgePoint = 2;
                    } else {
                        console.log('entered 1')
                        badgePoint = 1;
                    }
                    point = 0;
                    console.log('bp before', badgePoint)
                    console.log('before', point)
                } else {
                    console.log('sol not found')
                    badgePoint = 0;

                    //check if user submits challenge within time and give points
                    if (client.dateEST() === parseInt(dayNumber)) {
                        point = 2;
                    } else {
                        point = 1;
                    }
                    console.log('bp after', badgePoint)
                }

                Snippet.create({ dayNumber, userid, url, userName, langName, avatarUrl }, function (err, newData) {
                    if (err) {
                        console.log(err);
                    } else {
                        //experiment code
                        User.findOne({ userid: message.author.id }, function (err, userData) {
                            if (err) {
                                console.log(err);
                            }
                            if (userData) {
                                // console.log(userData)
                                // console.log("user exists")
                                console.log('after', point)
                                console.log('bp afterafter', badgePoint)

                                User.findByIdAndUpdate(userData._id, { point: userData.point+point, badgePoint: userData.badgePoint+badgePoint }, (err, updatedBlog) => {
                                    if (err) {

                                        console.log(err)
                                    } else {

                                        //rerunning advent.js
                                        // advent.run()

                                        // console.log('updated')
                                    }
                                });


                                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                            } else {
                                // console.log("user doesn't exist");
                                // console.log(message.author.username);

                                //since user doesn't exist badgePoint will be 0
                                badgePoint = 0;


                                //check if user submits challenge within time and give points
                                if (client.dateEST() === parseInt(dayNumber)) {
                                    point = 2;
                                } else {
                                    point = 1;
                                }

                                User.create({ username, userid, badgePoint, avatarUrl, point }, function (err, newData) {
                                    if (err) {
                                        console.log(err);
                                    } else {

                                        //rerunning advent.js
                                        // advent.run()

                                        // console.log('user saved');
                                    }
                                });
                            }
                        });

                    }
                });
            });


            process.on('exit', (code) => {
                console.log("Process quit with code : " + code);
            });

            ///////////////////////////////////////////////////////////////
            console.log("Submission Successfull")
            const pp = client.emojis.find(emoji => emoji.name === "thumbsup");
			console.log(typeof(pp));
			console.log(pp);
            message.react("??");
			//message.react(message.guild.emojis.get('642473473498939423'));
            // Update stats API page and Discord Widget
            client.recentSubmissions([username, url])

            let subChan = client.channels.get("642476953571688459");

            const embed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor("#238c53")
                .setThumbnail("https://cdn0.iconfinder.com/data/icons/christmas-flat-ten/128/christmas-flat-ten-bulb-512.png")
                .setDescription(`Check out my solution for day ${dayNumber} of Advent of Code: \n ${url} \n\nCheck out all solutions [here](https://zerotomastery.io/events/advent-of-code.html)`)


            subChan.send(message.author.toString())
            subChan.send({ embed });

        }
    });



}


const sendMenu = (client, message) => {
    let adventMenu = new Discord.RichEmbed()
        // changing setAuthor to setTitle below
        .setTitle("Advent of Code - 2018")
        .setThumbnail("http://icons.iconarchive.com/icons/stevelianardo/free-christmas-flat/256/christmas-tree-icon.png")
        .setColor("B3000C")
        .setDescription("This month we are doing a special coding challenge! December is the best time of the year to be a programmer since the Advent of Code begins!... [Read More Here](https://github.com/zero-to-mastery/coding_challenge-12).")
        .addField("📋 About AoC", "Find out more [here](https://adventofcode.com)", true)
        .addField(`:calendar:  Todays Challenge`, `Check it out [here](https://adventofcode.com/2018/day/${client.timeEST().getDate()})`, true)
        .addField(`:eye: View Solutions`, `ZTM solutions [here](https://zerotomastery.io/events/advent-of-code.html)`, true)
        .addField(":medal: View Leaderboard", "How do your [rank?](https://zerotomastery.io/events/advent-of-code.html?leaderboard)", true)
        .addBlankField()
        .addField(`🔗 Submit Solution`, '**Submit your solution using this command structure:** \n`+aoc submit <day> <url> <language>` \n**For example**\n +aoc submit 5 https://repl.it/test javascript', false)
    message.channel.send({ embed: adventMenu });
}





exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["aoc"],
    permLevel: "User"
};

exports.help = {
    name: "advent",
    category: "Challenges",
    description: "Advent of Code Commands",
    usage: "advent"
};
