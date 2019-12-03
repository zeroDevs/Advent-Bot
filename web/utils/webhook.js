const axios = require("axios");
const tokens = require("../../configs/tokens.json");

exports.submissionWebhook = ({ username, url, day, thumb, lang, time }) => {
    console.log(username, url, thumb, day);

    axios
        .post(tokens.submissionWebhook, {
            crossdomain: true,
            embeds: [
                {
                    title: "New AoC Submission!",

                    description: `**${username}** just submitted a solution for day ${day}, written in ${lang}! \nCheck it out [here](${url})`,
                    color: 8392720,
                    thumbnail: {
                        url: thumb
                    },
                    footer: {
                        text: `Submitted At (EST): ${time}`
                    }
                }
            ]
        })
        .then(result => {
            console.log("SUCCESS!");
        })
        .catch(err => {
            console.log("ERROR!\n", `RESULT CODE: ${err}`, `RESULT STATUS ${err}`);
        });
};

exports.errorWebhook = ({ errorTitle, errorDesc }) => {
    axios
        .post(tokens.errorWebhook, {
            crossdomain: true,
            embeds: [
                {
                    title: `An Error was detected`,
                    description: `${errorTitle}\n\`\`\` ${errorDesc.slice(0, 1023)} \`\`\` `,
                    color: 16740352
                }
            ]
        })
        .then(result => {
            console.log("SUCCESS!");
        })
        .catch(err => {
            console.log("ERROR!\n", `RESULT CODE: ${err}`, `RESULT STATUS ${err}`);
        });
};
