const Discord = require("discord.js");

module.exports = client => {
    client.fetchMessages = channel => {
        return channel
            .fetchMessages({
                limit: 100
            })
            .then(messages => {
                return messages;
            });
    };
};
