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
    method: 'GET',
    url: 'https://your-domain.xyz/script',
    rejectUnauthorized: false,
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