const config = {

  tokens: {
    botToken: require("./tokens.json").token,
    mongoToken: require("./tokens.json").mongo,
  },
  
  general: {
    prefix: "+",
    blankEmoji: require("./tokens.json").BLANK_EMOJI
  },
};

module.exports = config;
