const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./WLBOT.js', { token: `INSERT_TOKEN_HERE` });
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();