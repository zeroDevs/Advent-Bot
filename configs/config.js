const config = {

  tokens: {
    botToken: require("./tokens.json").token,
    mongoToken: require("./tokens.json").mongo,
  },
  
  general: {
    prefix: "+",
  },
};

module.exports = config;
