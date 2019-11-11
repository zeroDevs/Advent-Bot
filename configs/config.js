const config = {

  tokens: {
    botToken: require("./tokens.json").token,
    mongoToken: require("./tokens.json").mlabs,
  },
  
  general: {
    prefix: "+",
  },
};

module.exports = config;
