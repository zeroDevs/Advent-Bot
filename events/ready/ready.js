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
        client.sendEmbed(
            client,
            {
                author: [
                    `Rusty`,
                    "https://cdn.discordapp.com/app-icons/513757093908447253/432337d31cf027081288c4d0ba33d20b.png"
                ],
                color: 8311585,
                desc: `Johny5 is alive...`,
                thumbnail:
                    "https://cdn.discordapp.com/attachments/650478169157271583/650514804683046912/Untitled-2.png"
            },
            client.channels.find("id", "455756883140018176")
        );
    } catch (e) {
        console.log(e.stack);
    }
};
