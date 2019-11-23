const Discord = require("discord.js");

// if the bot does not use the database, move these to the server.js file
// this'll expose the same connection globally for bot and server
const tokens = require("./configs/tokens.json");
const db = require("./database");
db.connect(tokens.mongo).then(() => "database is connected");

//Prevents the bot from using @everyone
const client = new Discord.Client({ disableEveryone: true });
require("./web/server")(client);
client.settings = require(`./configs/config`);
client.commands = new Discord.Collection();
client.cmdsLoaded = { list: "", size: 0 };

// Load handlers
client.commandHandler = require("./handlers/commands.handler")(client);
client.eventHandler = require(`./handlers/events.handler`)(client);
client.functionHandler = require(`./handlers/modules.handler`)(client);

client.login(client.settings.tokens.botToken);
