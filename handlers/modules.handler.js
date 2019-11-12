const { readdir } = require("fs");

const ascii = require("ascii-table");

let moduleTable = new ascii("Modules");
moduleTable.setHeading("Module", "Load status");

const stats = {
    total: 0
}

module.exports = (client) => {

    readdir('./modules/', (err, files) => {

        if (err) return console.error(err);

        files.map(file => {
            stats.total ++
            require(`../modules/${file}`)(client)
            const moduleName = file.split('.')[0]
            moduleTable.addRow(moduleName, '   ✅   Module Loaded!   ');
        })

        moduleTable.setTitle(`Loaded ${stats.total} modules!`)
        moduleTable.setBorder("|", "~", ".", "'")
        console.log(moduleTable.toString());
    })

}