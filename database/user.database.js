const User = require("./user.model");
const userHandler = {};

// Checks is the user exists
userHandler.checkUser = username => {
    User.findOne({ username: username }, async function(error, result) {
        if (error) console.log("ERROR", error);
        else console.log(result);
    });
};

// Creates a user
userHandler.createUser = () => {};

// Update a user
userHandler.updateUser = () => {};

module.exports = userHandler;
