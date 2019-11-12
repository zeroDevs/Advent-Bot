const { readdirSync } = require("fs");

const ascii = require("ascii-table");

let commandsTable = new ascii("Commands");
commandsTable.setHeading("Command", "Load status");

const stats = {
    total: 0,
    failed: 0,
    loaded: 0
}

module.exports = (client) => {

    readdirSync("./commands/", { withFileTypes: true }).forEach(dir => {

        let commandName = dir.name

        if (dir.isFile()) {
            commandsTable.addRow(commandsTable, '   ❌   File cannot be in the commands root, must be inside a folder!   ');
            return
        }

        const commands = readdirSync(`./commands/${commandName}/`)

        for (let file of commands) {
            try {
                if (file === `${commandName}.command.js`) {
                    stats.total++
                    let pull = require(`../commands/${commandName}/${commandName}.command`);

                    if (pull.help === undefined) { 
                        commandsTable.addRow(`${client.settings.general.prefix}${commandName}`, '   ❌   Export Missing!   ');
                        stats.failed++;
                    } else if (pull.help.name) {
                        client.cmdsLoaded.list = `${client.cmdsLoaded.list} -${pull.help.name},`
                        client.commands.set(pull.help.name, pull);
                        commandsTable.addRow(`${client.settings.general.prefix}${commandName}`, '   ✅   Command Loaded!   ');
                        stats.loaded++;
                    } else {
                        commandsTable.addRow(`${client.settings.general.prefix}${commandName}`, `   ❌   Help.name Missing!   `);
                        stats.failed++
                        continue;
                    }
                }

            } catch (error) {
                console.log(error)
                if (error.code === "MODULE_NOT_FOUND") commandsTable.addRow(`${client.settings.general.botPrefix}${commandName}`, `   ❌   Index not found!   `);
                else commandsTable.addRow(`${client.settings.general.prefix}${commandName}`, `   ❌   Unknown Error!   `);
                stats.failed++
            }

        }
    });

    commandsTable.setTitle(`Loaded ${stats.loaded} of ${stats.total} commands!`)
    commandsTable.setBorder("|", "~", ".", "'")
    console.log(commandsTable.toString());
    client.cmdsLoaded.size = stats.total
}