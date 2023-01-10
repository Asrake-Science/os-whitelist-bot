# You require

- A capable vps (windows preferrably..)
- node.js
- WSL

## What's next

open your terminal, and cd into the os-whitelist-bot folder, then run

```js
 npm i all // this is not required if you've run this from the beginning
```

after that, check if your .env is set-up completely, if that's done, run

```js
const request = require('request');

const options = {
  method: 'POST',
  rejectUnauthorized: false,
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