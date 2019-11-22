const mongoose = require("mongoose");

module.exports = async client => {
    // Log that the bot is online.
    console.log(
        `${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`
    );

    client.user.setPresence({
        game: {
            name: `Advent of Code!`,
            type: "WATCHING"
        }
    });

    try {
        let link = await client.generateInvite(["ADMINISTRATOR"]);
        console.log(link);
    } catch (e) {
        console.log(e.stack);
    }

    mongoose
        .connect(`${client.settings.tokens.mongoToken}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log("Connected to the database"));
};
