# 👑 swagpex auth - RL001 👑

https://cdn.discordapp.com/attachments/1059780732412776498/1062350887470759977/RDT_20221227_190900.mp4

*   Bugtests

    ⬑ So far, there have been no bugs, if you find some.. please report them in the [issues tab](/issues)

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