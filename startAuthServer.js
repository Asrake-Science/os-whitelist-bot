const express = require('express');
const request = require('request');
const app = express();
const fs = require('fs')
const https = require('https')

app.use(express.json());

app.get('/script', (req, res) => {
  fs.readFile('./whitelist.json', 'utf8', (error, data) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
      return;
    }
    let whitelist;
    try {
      whitelist = JSON.parse(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
      return;
    }
    const key = req.get('fingerprint');
    for (const entry of whitelist.hwids) {
      if (entry.scriptKey === key) {
        fs.readFile('./HUB.lua', 'utf8', (error, data) => {
          if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.send(data);
        });
        return;
      }
    }
    res.status(401).send('Unauthorized');
    sUN_Script(req);
  });
});




app.post('/auth', (req, res) => {
  authenticate(req, (authenticated, userId) => {
    if (authenticated) {
      // to the Discord webhook URL
      sendToDiscordWebhook(req.body, userId);
      res.send('auth_passed');
    } else {
      res.status(401).send('auth_failed');
      sendUnauthorizedNotification(req);
    }
  });
});

app.post('/dibebabebube', (req, res) => {
  authenticate(req, (authenticated) => {
    if (authenticated) {
      res.send('auth_passed');
    } else {
      res.status(401).send('auth_failed');
      sendUnauthorizedNotification(req);
    }
  });
});


app.use('/scheck', express.static('public'));
app.use('/auth', express.static('public'));
app.use('/script', express.static('public'));
app.use('/', express.static('kekland'));
const options = {
  cert: fs.readFileSync('./SSL/certificate.crt'),
  key: fs.readFileSync('./SSL/private.key')
};
https.createServer(options, app).listen(443);
https.createServer(options, app).listen(80);
console.log("listening on 443 (SECURE)")
console.log("listening on 80 (NOT SECURE)")
function sendUnauthorizedNotification(req) {
  const payload = {
    "embeds": [
      {
        "title": "Unauthorized Request",
        "description": "Data Below has failed authentication on the webserver.",
        "color": 16711680,
        "fields": [
          {
            "name": "Key",
            "value": req.body.key
          },
          {
            "name": "HWID",
            "value": req.body.hwid
          }
        ],
        "footer": {
          "text": "swagpex hub™ on top",
          "icon_url": "https://cdn.discordapp.com/attachments/1059780732412776498/1061692808144109568/1022939026728169472.gif"
        }
      }
    ]
  };

  request.post({
    url: 'INSERT-YOUR-WEBHOOK-HERE',
    json: payload
  }, (error, res, body) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(`Status: ${res.statusCode}`);
  });
}
function sendToDiscordWebhook(req, userId) {
  const currentTime = new Date().toLocaleString();

  const payload = {
    "embeds": [
      {
        "title": "User Authenticated",
        "description": `User authenticated at ${currentTime}`,
        "fields": [
          {
            "name": "Key",
            "value": req.key
          },
          {
            "name": "HWID",
            "value": req.hwid
          }
        ],
        "footer": {
          "text": "swagpex hub™ on top",
          "icon_url": "https://cdn.discordapp.com/attachments/1059780732412776498/1061692902146846740/851062496285687831.gif"
        },
        "color": 65280
      }
    ]
  };

  request.post({
    url: 'INSERT-YOUR-WEBHOOK-HERE',
    json: payload
  }, (error, res, body) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(`Status: ${res.statusCode}`);
  });
}
function authenticate(req, callback) {
  fs.readFile('./whitelist.json', 'utf8', (error, data) => {
    if (error) {
      console.error(error);
      callback(false);
      return;
    }
    let whitelist;
    try {
      whitelist = JSON.parse(data);
    } catch (error) {
      console.error(error);
      callback(false);
      return;
    }
    const key = req.body.key;
    const hwid = req.body.hwid;
    for (const entry of whitelist.hwids) {
      if (entry.scriptKey === key) {
        if (!entry.id && hwid) {
          entry.id = hwid;
          fs.writeFile('./whitelist.json', JSON.stringify(whitelist, null, 4), 'utf8', (error) => {
            if (error) {
              console.error(error);
            }
          });
          callback(true, entry.userid);
          return;
        }
        else if (entry.id !== hwid) {
          callback(false);
          return;
        }
        else {
          callback(true, entry.userid);
          return;
        }
      }
    }

    callback(false);
  });
}


function sUN_Script(req) {
  const key = req.get('script-key');
  const ip = req.ip;

  const payload = {
    "embeds": [
      {
        "title": "Cracking Attempt",
        "description": "YuuHOO!!!!! MF been logged, fuck you!",
        "fields": [
          {
            "name": "Script Key",
            "value": key
          },
          {
            "name": "IP Address",
            "value": `||${req.ip.replace('::ffff:', '')}||`
          }
        ],
        "color": 16711680,
        "footer": {
          "text": "swagpex hub™ on top",
          "icon_url": "https://cdn.discordapp.com/attachments/1059780732412776498/1061692808144109568/1022939026728169472.gif"
        },
        "thumbnail": {
          "url": "https://cdn.discordapp.com/attachments/1059780732412776498/1061738991164063815/lmfaoooooo.gif"
        }
      }
    ]
  };

  request.post({
    url: 'INSERT-YOUR-WEBHOOK-HERE',
    json: payload
  }, (error, res, body) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(`Status: ${res.statusCode}`);
  });
}
