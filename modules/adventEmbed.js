const Discord = require("discord.js");
const embedData = require("../configs/aocEmbedData");

module.exports = client => {
  const blank = client.emojis.get(client.settings.general.blankEmoji);
  const data = embedData.aoc(blank);

  client.initAdventEmbed = () => {
    const channelAoc = client.channels.find("name", "advent-of-code");
    client.sendEmbed(client, data, channelAoc);
  };

  client.updateAdventEmbed = async what => {
    const channelAoc = client.channels.find("name", "advent-of-code");
    const newData = data;

    client.fetchMessages(channelAoc).then(msgs => {
      msgs.map(async e => {
        if (!e.embeds[0]) return;

        console.log(e.embeds[0].fields[14]);

        if (what.stats) {
          newData.fields[9][0] = `:arrows_counterclockwise: ${what.stats[0]} Solutions`;
          newData.fields[10][0] = `:calendar_spiral: ${what.stats[1]} Today`;
          newData.fields[11][0] = `:family_wwb:  ${what.stats[2]} Paticipants`;
        } else {
          newData.fields[9][0] = e.embeds[0].fields[9][0];
          newData.fields[10][0] = e.embeds[0].fields[10][0];
          newData.fields[11][0] = e.embeds[0].fields[11][0];
        }

        if (what.recent) {
          let i = 14;
          what.recent.map(p => {
            newData.fields[i][0] = p.name;
            newData.fields[i][1] = `[View Submission](${p.url})`;
            i++;
          });
        } else {
          let i = 14;
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
