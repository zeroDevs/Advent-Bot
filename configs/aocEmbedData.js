const Discord = require("discord.js");
const day = new Date().getDate();

exports.aoc = blank => {
    return {
        title: "Advent of Code - 2019",
        url: "https://aoc.zerotomastery.io",
        color: 11928601,
        desc: `This month we are doing a special coding challenge! December is the best time of the year to be a programmer since the Advent of Code begins!... You can find the challenge repo [here](https://github.com/zero-to-mastery/coding_challenge-24) \n${blank}`,
        thumbnail: `https://images-ext-1.discordapp.net/external/aMljZIkjMJOZLM6dg_GEkOvXc3n2dt3neyHSl3zUUNQ/http/icons.iconarchive.com/icons/stevelianardo/free-christmas-flat/256/christmas-tree-icon.png`,
        fields: [
            [
                ":clipboard: About AoC",
                "Find out more [here](https://adventofcode.com/2019/about)",
                true
            ],
            [
                ":calendar:  Todays Challenge",
                `Check it out [here](https://adventofcode.com/2018/${day})`,
                true
            ],
            [
                ":eye: View Solutions",
                "ZTM solutions [here](https://aoc.zerotomastery.io/solutions)",
                true
            ],
            [
                ":medal: View Leaderboard",
                "How do your [rank](https://aoc.zerotomastery.io/leaderboard)?",
                true
            ],
            [blank, blank],
            [
                ":white_check_mark:   Sumbmit Your Solutions   :white_check_mark:  ",
                "=-=-=-=-=-=-=-=-=-=-==-=-=-=-=",
                false
            ],
            [
                ":link: **Submit Your Solution**",
                " You can submit your solution over [here](https://aoc.zerotomastery.io/submit)"
            ],
            [blank, blank],
            [
                ":bar_chart:   Statistics  :bar_chart: ",
                "=-=-=-=-=-=-=-=-=",
                false
            ],
            [
                ":arrows_counterclockwise: 355 Solutions",
                "Total Solutions",
                true
            ],
            [":calendar_spiral: 55 Today", "Todays Solutions", true],
            [":family_wwb:  77 Paticipants", "Total ZTM'ers", true],
            [blank, blank],
            [
                ":new:    Recent Submissions    :new:",
                "=-=-=-=-=-=-=-=-=-=-==-=-=-=",
                false
            ],
            ["Craig Trent", "[View Solution](https://test.com)", true],
            ["Jim Bean", "[View Solution](https://test.com)", true],
            ["Tom Davids", "[View Solution](https://test.com)", true],
            ["James Dean", "[View Solution](https://test.com)", true],
            ["Martha Smith", "[View Solution](https://test.com)", true],
            ["Chloe Stuart", "[View Solution](https://test.com)", true]
        ],
        footer: ["Last updated: never"]
    };
};
