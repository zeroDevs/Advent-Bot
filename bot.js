const Discord = require("discord.js");

//Prevents the bot from using @everyone
const client = new Discord.Client({disableEveryone: true});
require("./web/adventConfig")(client);
client.settings =  require(`./configs/config`);
client.commands = new Discord.Collection();
client.cmdsLoaded = {list: "", size: 0};

// Load handlers
client.commandHandler = require('./handlers/commands.handler')(client)
client.eventHandler = require(`./handlers/events.handler`)(client)
client.functionHandler = require(`./handlers/modules.handler`)(client)

client.login(client.settings.tokens.botToken)