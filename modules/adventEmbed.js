const Discord = require("discord.js");
const day = new Date().getDate();
const moment = require("moment");
const embedData = require("../configs/aocEmbedData");
const StatsService = require("../web/services/Stats.service");

module.exports = client => {
    client.initAdventEmbed = async () => {
        const stats = await StatsService.getStats();
        const blank = client.emojis.get(`587088664522391593`);
        console.log(111, stats);
        const data = embedData.aoc(blank, day, moment().format("MMM Do YYYY, h:mm:ss a"), stats);
        const channelAoc = client.channels.find("name", "recapoftheday");
        client.sendEmbed(client, data, channelAoc);
    };

    client.updateAdventEmbed = async what => {
        const blank = client.emojis.get(`587088664522391593`);
        const stats = await StatsService.getStats();
        const data = embedData.aoc(blank, day, moment().format("MMM Do YYYY, h:mm:ss a"), stats);
        const channelAoc = client.channels.find("name", "recapoftheday");
        const newData = data;

        client.fetchMessages(channelAoc).then(msgs => {
            msgs.map(async e => {
                if (!e.embeds[0] || e.embeds[0].title !== `Advent of Code - ${day} Dec 2019 Recap`)
                    return;
                if (what.stats) {
                    newData.fields[2][0] = `:arrows_counterclockwise: ${what.stats[0]} Solutions`;
                    newData.fields[3][0] = `:calendar_spiral: ${what.stats[1]} Today`;
                    newData.fields[4][0] = `:family_wwb:  ${what.stats[2]} Paticipants`;
                } else {
                    newData.fields[2][0] = e.embeds[0].fields[9][0];
                    newData.fields[3][0] = e.embeds[0].fields[10][0];
                    newData.fields[4][0] = e.embeds[0].fields[11][0];
                }

                if (what.recent) {
                    let i = 7;
                    what.recent.map(p => {
                        newData.fields[i][0] = p.name;
                        newData.fields[i][1] = `[View Submission](${p.url})`;
                        i++;
                    });
                } else {
                    let i = 7;
                    newData.fields.map((f, index) => {
                        if (index === i) {
                            newData.fields[i] = [
                                e.embeds[0].fields[i].name,
                                e.embeds[0].fields[i].value,
                                true
                            ];
                            i++;
                        }
                    });
                }
                newEmbed = await client.editEmbed(newData);
                e.edit(newEmbed);
            });
        });
    };
};
