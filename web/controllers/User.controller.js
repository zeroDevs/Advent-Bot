const User = require("../models/User.model");

class UserController {
    constructor(logger) {
        this.logger = logger; // not in use yet, implement
    }

    async userExists(username) {
        try {
            const user = User.findOne({ username }).exec();
            return Boolean(user);
        } catch (error) {
            // this.logger.error(`*userExists*: ${error}`);
        }
    }

    async createUser(user) {
        try {
            const newUser = new User({ ...user });
            newUser.save();
            return true;
        } catch (error) {
            // this.logger.error(`*createUser*: ${error}`);
        }
    }

    async updateUser(userid, updatedUser) {
        try {
            await User.findOneAndUpdate({ userid }, { ...updatedUser }).exec();
            return true;
        } catch (error) {
            // this.logger.error(`*updateUser*: ${error}`);
        }
    }

    async deleteUser(userid) {
        try {
            await User.findOneAndDelete({ userid }).exec();
            return true;
        } catch (error) {
            // this.logger.error(`*deleteUser*: ${error}`);
        }
    }
}

module.exports = UserController;
