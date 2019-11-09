module.exports = (client) => {
    const Discord = require("discord.js");
    const fetch = require('node-fetch');
    const moment = require('moment');
    fs = require('fs');


    // Fetch stats and combine them into one file
    client.updateStats = async (r) => {

        // time convertion to EST
        var dt = new Date();
        var offset = -300; //Timezone offset for EST in minutes.
        var estDate = new Date(dt.getTime() + offset * 60 * 1000);

        const object = {}
        await fetch("http://localhost:8001/advent/solutions/all")
            .then(res => res.json())
            .then(json => object["all"] = json.length)

        await fetch("http://localhost:8001/advent/solutions/?day=" + estDate.getDate())
            .then(res => res.json())
            .then(json => object["day"] = json.length)

        await fetch("http://localhost:8001/advent//user")
            .then(res => res.json())
            .then(json => object["user"] = json.length)

        // console.log("some json", JSON.stringify(object))
        fs.writeFile("./web/advent/adventData.json", JSON.stringify(object), function (err) {
            if (err) {
                return console.log("AdventUpdate Module - 1", err);
            }

            console.log("The advent Stats file was updated");
        });
    }

    // Update the stats embed
    client.getStats = async (rSubs) => {
        console.log("getStats Running")
        const chan = client.channels.get("518018460916252672");
        let stats;



        await fetch('http://localhost:8001/advent/data')
            .then(res => res.json())
            .then(json => stats = json);



        await chan.fetchMessages({ around: "518486469145264178", limit: 1 })
            .then(messages => {
                const fetchedMsg = messages.first(); // messages is a collection!)

                var dt = new Date();
                var offset = -300; //Timezone offset for EST in minutes.
                var estDate = new Date(dt.getTime() + offset * 60 * 1000);


                // do something with it
                const newEmbed = new Discord.RichEmbed()
                    .setTitle("Advent of Code Stats")
                    .setDescription(``)
                    .addField(`:arrows_counterclockwise: ${stats.all} Solutions`, "Total Solutions", true)
                    .addField(`🗓 ${stats.day} Today`, "Todays Total", true)
                    .addField(`:family_wwb:  ${stats.user} Paticipants`, "Total ZTM Paritcipants", true)
                    .addBlankField()
                    .addField(" :new: Recent Submissions :new: ", "=-=-=-=-=-=-=-=-=-=-=")
                    .setFooter(`❇ Last Updated: ${moment(estDate).format('MMM Do - h:mm a')}  EST`)

                rSubs.forEach(rs => {
                    if(rs !== null){
                        newEmbed.addField(rs[0], `[View Solution](${rs[1]})`, true)
                        // console.log("something", rs[0], rs[1])
                    }

                });

                fetchedMsg.edit(newEmbed);


            });
    }

    // Recent Submissions
    client.recentSubmissions = async (newSub) => {
        console.log("Running Recent Submissions Function")
        await client.updateStats()
        var recentSub = JSON.parse(fs.readFileSync("./web/advent/recentSubmissions.json", { "encoding": "utf-8" }))
        // console.log("RECENT: ", recentSub, recentSub.length)

        if (recentSub.length > 8) recentSub.pop()
        recentSub.unshift(newSub)

        fs.writeFile("./web/advent/recentSubmissions.json", JSON.stringify(recentSub), function (err) {
            if (err) {
                return console.log("adventUpdate - 2", err);
            }

            // console.log("The newSub file was updated");
            client.getStats(recentSub)
        });
    }

    // Update the stats embed
    client.forceStatsUpdate = async () => {
        const chan = client.channels.get("518018460916252672");
        let stats;
        var rSubs = JSON.parse(fs.readFileSync("./web/advent/recentSubmissions.json", { "encoding": "utf-8" }))


        await fetch('http://localhost:8001/advent/data')
            .then(res => res.json())
            .then(json => stats = json);



        await chan.fetchMessages({ around: "526502072124702720", limit: 1 })
            .then(messages => {
                const fetchedMsg = messages.first(); // messages is a collection!)

                var dt = new Date();
                var offset = -300; //Timezone offset for EST in minutes.
                var estDate = new Date(dt.getTime() + offset * 60 * 1000);


                // do something with it
                const newEmbed = new Discord.RichEmbed()
                    .setTitle("Advent of Code Stats")
                    .setDescription(``)
                    .addField(`:arrows_counterclockwise: ${stats.all} Solutions`, "Total Solutions", true)
                    .addField(`🗓 ${stats.day} Today`, "Todays Total", true)
                    .addField(`:family_wwb:  ${stats.user} Paticipants`, "Total ZTM Paritcipants", true)
                    .addBlankField()
                    .addField(" :new: Recent Submissions :new: ", "=-=-=-=-=-=-=-=-=-=-=-=-=-")
                    .setFooter(`❇ Last Updated: ${moment(estDate).format('MMM Do - h:mm a')}  EST`)

                rSubs.forEach(rs => {

                    newEmbed.addField(rs[0], `[View Solution](${rs[1]})`, true)
                });

                fetchedMsg.edit(newEmbed);


            });
    }

    // Update the general embed containing
    client.forceGeneralUpdate = async () => {
        const chan = client.channels.get("518018460916252672");
        let stats;



        await chan.fetchMessages({ around: "518408693629321216", limit: 1 })
            .then(messages => {
                const fetchedMsg = messages.first(); // messages is a collection!)

                var dt = new Date();
                var offset = -300; //Timezone offset for EST in minutes.
                var estDate = new Date(dt.getTime() + offset * 60 * 1000);


                // do something with it
                const newGeneralEmbed = new Discord.RichEmbed()
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
                    .setFooter(`❇ Last Updated: ${moment(estDate).format('MMM Do - h:mm a')}  EST`)


                fetchedMsg.edit(newGeneralEmbed);


            });
    }
}
