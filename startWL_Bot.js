const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./D_JS-Node/WLBOT.js', { token: `INSERT_TOKEN_HERE` });
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();