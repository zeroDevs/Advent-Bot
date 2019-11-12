const { readdirSync } = require("fs");

const ascii = require("ascii-table");

let eventsTable = new ascii("Events");
eventsTable.setHeading("Event", "Load status");

const stats = {
    total: 0
}

module.exports = (client) => {

    readdirSync("./events/", { withFileTypes: true }).forEach(dir => {

        if (dir.isFile()) {
            eventsTable.addRow(dir.name, '   ❌   File cannot be in the events root, must be inside a folder!   ');    
            return 
        }

        const events = readdirSync(`./events/${dir.name}/`)

        for (let file of events) {

            try {

                let event = require(`../events/${dir.name}/${dir.name}`);

                stats.total ++
                const eventName = dir.name
                client.on(eventName, event.bind(null, client));
                eventsTable.addRow(eventName, '   ✅   Event Loaded!   ');

            } catch (error) {
                eventsTable.addRow(dir.name, `   ❌   Unknown Error!   `);
            }

        }
    });

    eventsTable.setTitle(`Loaded ${stats.total} events!`)
    eventsTable.setBorder("|", "~", ".", "'")
    console.log(eventsTable.toString());
}