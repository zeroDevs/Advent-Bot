module.exports = async client => {
    // Log that the bot is online.
    console.log(
        `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
    );

    client.user.setActivity(`Advent of Code!`, { type: "PLAYING" });

    try {
        let link = await client.generateInvite();
        console.log(link);
        // client.statsCron();
    } catch (e) {
        console.log(e.stack);
    }
};
