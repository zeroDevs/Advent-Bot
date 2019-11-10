const router = require('express').Router();
const jwt  = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

const { catchAsync } = require('./utils');

router.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${tokens.CLIENT_ID}&scope=identify%20guilds&response_type=code&redirect_uri=${tokens.redirect}`);
});

router.get('/discord/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  const creds = btoa(`${tokens.CLIENT_ID}:${tokens.CLIENT_SECRET}`);
  const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&scope=identify%20guilds&code=${code}&redirect_uri=${tokens.redirect}`,
    {
      method: 'POST',
      headers: {
        "Authorization": `Basic ${creds}`,
        "Content-Type": "application/json"
      },
    });
  const json = await response.json();
  console.log(json);

  jwt.sign({aToken: json.access_token}, "y3l10whulk", {expiresIn: "2d"}, (err, token) => {
    if(err) throw err;
    res.redirect(`${tokens.redirect_front}/?token=${token}`);
  });
}));

router.post('/submit', (req, res) => {
    console.log(req);
    res.status(200).json({error: null, isSuccessful: "True"});
});

module.exports = router;
