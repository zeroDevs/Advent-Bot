const User = require("../models/User.model");

class UsersService {
    constructor(logger) {
        // this.logger = logger; // switch to use real logger
        this.logger = console;
    }

    async allUsers(username) {
        try {
            const user = User.find({}).exec();
            return user;
        } catch (error) {
            this.logger.error(`*userExists*: ${error}`);
        }
    }

    async userExists(username) {
        try {
            const user = User.findOne({ username }).exec();
            return Boolean(user && user.length > 0);
        } catch (error) {
            this.logger.error(`*userExists*: ${error}`);
        }
    }

    async createUser(user) {
        try {
            const newUser = new User({ ...user });
            newUser.save();
            return true;
        } catch (error) {
            this.logger.error(`*createUser*: ${error}`);
        }
    }

    async updateUser(userid, updatedUser) {
        try {
            await User.findOneAndUpdate({ userid }, { ...updatedUser }).exec();
            return true;
        } catch (error) {
            this.logger.error(`*updateUser*: ${error}`);
        }
    }

    async deleteUser(userid) {
        try {
            await User.findOneAndDelete({ userid }).exec();
            return true;
        } catch (error) {
            this.logger.error(`*deleteUser*: ${error}`);
        }
    }
}

module.exports = new UsersService();
