module.exports = (client) => {

  // EST TIMEZONE
  client.timeEST = () =>{
      //  time convertion to EST
      var dt = new Date();
      var offset = -300; //Timezone offset for EST in minutes.
      return new Date(dt.getTime() + offset * 60 * 1000);
  }
  client.dateEST = () =>{
    //  date convertion to EST
    var dt = new Date();
    var offset = -300; //Timezone offset for EST in minutes.
    let d = new Date(dt.getTime() + offset * 60 * 1000)
    console.log("DATE __ ", d.getDate())
    return d.getDate();
}

    /*
    SINGLE-LINE AWAITMESSAGE
    A simple way to grab a single reply, from the user that initiated
    the command. Useful to get "precisions" on certain things...
    USAGE
    const response = await client.awaitReply(msg, "Favourite Color?");
    msg.reply(`Oh, I really love ${response} too!`);
    */
    client.awaitReply = async (msg, question, limit = 10000) => {
      const filter = m => m.author.id === msg.author.id;
      await msg.channel.send(question);
      try {
        const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
        return collected.first();
      } catch (e) {
        return msg.channel.send("You didnt respond quick enough");
      }
    };
  
    /* MISCELANEOUS NON-CRITICAL FUNCTIONS */
    
    // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
    // later, this conflicts with native code. Also, if some other lib you use does
    // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
    // are, we feel, very useful in code. 
    
    // <String>.toPropercase() returns a proper-cased string such as: 
    // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
    String.prototype.toProperCase = function() {
      return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };    
    
    // <Array>.random() returns a single random element from an array
    // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
    Array.prototype.random = function() {
      return this[Math.floor(Math.random() * this.length)]
    };
  
    // `await client.wait(1000);` to "pause" for 1 second.
    client.wait = require("util").promisify(setTimeout);
  
    // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
    process.on("uncaughtException", (err) => {
      const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
      console.log(`Uncaught Exception: ${errorMsg}`);
      // Always best practice to let the code crash on uncaught exceptions. 
      // Because you should be catching them anyway.
      process.exit(1);
    });
  
    process.on("unhandledRejection", err => {
      console.log(`Unhandled rejection: ${err}`);
    });

  };