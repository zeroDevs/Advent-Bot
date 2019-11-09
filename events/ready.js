module.exports = async client => {
    // Log that the bot is online.
    console.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`);

    // Sets the Bots "PLaying/Watching/Streaming" Status
    const io = client.guilds.get("423464391791476747")
    await io.fetchMembers() 
    console.log("MemberCount",io.memberCount)
    console.log("Bots",io.members.filter(member => member.user.bot).size)
    console.log("OldMethod", io.members.filter(member => !member.user.bot).size)
    await console.log(io.memberCount )
    console.log(
        io.members.filter(member => !member.user.bot).size
        )
    client.user.setPresence({
        game: {
            name: `over ${io.members.filter(member => !member.user.bot).size} Users!`,
            type: "WATCHING"
        }
    });

    
    try {
        let link = await client.generateInvite(["ADMINISTRATOR"]);
        console.log(link);
    } catch (e) {
        console.log(e.stack)
    }

};