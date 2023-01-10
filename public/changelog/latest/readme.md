<p align="center">
  <img width="" src="https://raw.githubusercontent.com/Asrake-Science/os-whitelist-bot/main/public/stylesheet/assetstorage/allalalaa.png" />
</p>
<h1 align="center">👑 SWAGPEX AUTH - RL001 👑</h1>

<p align="center">
<a>
 <img src="https://img.shields.io/badge/Version-RL--001-brightgreen"/>
</a>
  <a href="https://discord.gg/4kRf7vVfrt">
    <img src="https://img.shields.io/discord/1012316104061890710?color=7489d5&logo=discord&logoColor=ffffff" />
  </a>
</p>
<p align="center>

<video width="320" height="240" controls>
  <source src="https://user-images.githubusercontent.com/70854720/211556498-a300d44a-f35f-4993-9873-0b8599cd08c9.mp4" type="video/mp4">
</video>
</p>

*   Bugtests

    ⬑ So far, there have been no bugs, if you find some.. please report them in the [issues tab](https://github.com/Asrake-Science/os-whitelist-bot/issues)

*   Beautiful HTML Site Design

    ⬑ The site, which will stay static, loads in when you access the following endpoints: (/,/auth,/script)

*   Webhook Notifications

    ⬑ swagpex auth includes a webhook system (Proxy) which you can use to monitor on how many people are using your script.

    ⬑ To save time, if you want to change your webhook URL, just change out the WEBHOOK_URI in your .env file


## How to test if your endpoints are working


* Example on the /script endpoint:

```js
const request = require('request');


const options = {
    method: 'GET',
    url: 'https://your-domain.xyz/script',
    rejectUnauthorized: false, // this is useful when your SSL doesnt accept outside connections (debug only)
    headers: {
      'fingerprint': 'KEY-GOES-HERE'
    }
  };
  
  request(options, (error, res, body) => {
    if (error) {
      console.error(error);
      return;
    }
  
    console.log(`Status: ${res.statusCode}`);
    console.log(body);
  });
```

* Example on the /auth endpoint:

```js
const request = require('request');

const options = {
  method: 'POST',
  rejectUnauthorized: false, // this is useful when your SSL doesnt accept outside connections (debug only)
  url: 'https://your-domain.xyz/auth',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    key: 'KEY-GOES-HERE',
    hwid: 'HWID-GOES-HERE'
  })
};

request(options, (error, res, body) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(`Status: ${res.statusCode}`);
  console.log(body);
});
```