const Discord = require("discord.js");

exports.aoc = (blank, day, client, stats) => {
    const spacer = "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002";
    const desc = [
        `This month we are doing a special coding challenge! December is the best time of the year to be a programmer since the Advent of Code begins!... You can find the challenge repo [here](https://github.com/zero-to-mastery/coding_challenge-33) \n${blank}`,
        `\n:calendar:  [**Today's Challenge**](https://adventofcode.com/2020/day/${day})${spacer}:link: [**Submit Your Solution**](https://aoc.zerotomastery.io/submit)\n${blank}`,
        `\n:eye: [**View Solutions**](https://aoc.zerotomastery.io/solutions)${spacer}\u2002\u2002:medal: [**View Leaderboard**](https://aoc.zerotomastery.io/leaderboard)`
    ];
    return {
        title: `Advent of Code - ${day} Dec 2020 Recap`,
        url: "https://aoc.zerotomastery.io",
        color: 11928601,
        desc: `${desc[0]}${desc[1]}${desc[2]}`,
        thumbnail: `https://images-ext-1.discordapp.net/external/aMljZIkjMJOZLM6dg_GEkOvXc3n2dt3neyHSl3zUUNQ/http/icons.iconarchive.com/icons/stevelianardo/free-christmas-flat/256/christmas-tree-icon.png`,
        fields: [
            [blank, blank],
            [":bar_chart:   **Statistics**", "=-=-=-=-=-=-=-=-=", false],
            [
                `:arrows_counterclockwise: ${stats.totalSolutions} Solutions`,
                "Total Solutions",
                true
            ],
            [`:calendar_spiral: ${stats.todaysSolutions} Today`, "Todays Solutions", true],
            [`:family_wwb: ${stats.totalUsers}  Paticipants`, "Total ZTM'ers", true],
            [blank, blank],
            [":new:    **Recent Submissions**", "=-=-=-=-=-=-=-=-=-=-==-=-=-=", false],
            [blank, blank, true],
            [blank, blank, true],
            [blank, blank, true],
            [blank, blank, true],
            [blank, blank, true],
            [blank, blank, true]
        ],
        footer: [`Last Updated: ${client}`]
    };
};
