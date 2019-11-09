const Discord = require("discord.js");


exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "pp",
    category: "Miscelaneous",
    description: "Display info about the bot and its contributors",
    usage: "test"
};




exports.run = async (client, message, args, level, user, reaction) => { // eslint-disable-line no-unused-vars
   const pp = client.emojis.find(emoji => emoji.name === "200");

message.react(pp)



}