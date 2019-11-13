const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  // eslint-disable-line no-unused-vars

  const aocChannel = client.channels.find("name", "advent-of-code");
  const authedUser = message.member.roles.some(r => ["Admin"].includes(r.name));

  if (!authedUser) {
    message.reply("Unauthed!");
    return;
  }

  if (args[0] === "init")
    client.initAdventEmbed(client.channels.find("name", "advent-of-code"));
  else
    client.updateAdventEmbed({
      stats: [99, 88, 77],
      recent: [
        { name: "Billy11111111111111111111", url: "https://abc.com" },
        { name: "Fred", url: "https://abc.com" },
        { name: "Sandra", url: "https://abc.com" },
        { name: "Ted", url: "https://abc.com" },
        { name: "Sally", url: "https://abc.com" },
        { name: "Emma", url: "https://abc.com" }
      ]
    });
};

exports.help = {
  name: "advent"
};
