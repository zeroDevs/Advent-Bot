const Discord = require("discord.js");
const CronJob = require("cron").CronJob;

module.exports = client => {
    // Creates a cronjob to display the stats embed just before midnight
    client.statsCron = async (req, author) => {
        new CronJob(
            "1 0 0 * * *",
            function() {
                console.log("CRON1");
                client.commands.get(`advent`).run(client, false, ["init"]);
            },
            null,
            true,
            "America/Toronto"
        );
    };
};
