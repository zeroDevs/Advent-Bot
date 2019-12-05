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
        client.statsCron();
    } catch (e) {
        console.log(e.stack);
    }
};
