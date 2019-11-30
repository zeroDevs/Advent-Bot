const Discord = require("discord.js");
const CronJob = require("cron").CronJob;

module.exports = client => {
    // Creates a cronjob to display the stats embed just before midnight
    client.statsCron = async (req, author) => {
        new CronJob(
            "01 00 00 * * *",
            function() {
                client.updateStats();
            },
            null,
            true,
            "America/Toronto"
        );
    };
};
