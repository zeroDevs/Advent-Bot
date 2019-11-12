const Discord = require("discord.js");

// This event executes when a reaction is added to a message

module.exports = async (client, reaction, user) => {
    // Ignore Bot Reactions
    if(user.bot) return

    // Menu Reactions
    // if(reaction.message.embeds[0]){
    //     console.log("ReactionAdd Event")
    //     menu.react(client, reaction, user)
    // }
};