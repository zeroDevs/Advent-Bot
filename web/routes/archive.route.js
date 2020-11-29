const route = require("express").Router();

route.get("/:year", (req, res) => {
  console.log(req.params.year)
  try {
    const json = require(`../archive_data/${req.params.year}.json`);
    res.status(200).json(json);
  } catch(ex) {
    console.log("File not found");
    res.status(400).json({error: "File not in archive."});
  }
});

module.exports = route;