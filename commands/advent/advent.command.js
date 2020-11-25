const Discord = require("discord.js");
const moment = require("moment");

exports.run = async (client, message, args) => {
    // eslint-disable-line no-unused-vars

    if (message !== false && !message.member.roles.cache.some(r => ["Management Team"].includes(r.name))) {
        return;
    }

    if (args[0] === "init") client.initAdventEmbed();
    else {
        const StatsService = require("../../web/services/Stats.service");
        const SolutionsService = require("../../web/services/Solutions.service");
        const stats = await StatsService.getStats(moment().format('YYYY'));
        const recent = await SolutionsService.getRecentSolutions(6, moment().format('YYYY'));
        const rSols = [];
        await recent.map(r => rSols.push({ name: r.userName, url: r.url }));
        client.updateAdventEmbed({
            stats: [stats.totalSolutions, stats.todaysSolutions, stats.totalUsers],
            recent: rSols
        });
    }
};

exports.help = {
    name: "advent"
};
