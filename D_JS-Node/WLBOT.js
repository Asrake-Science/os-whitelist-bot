const Enmap = require("enmap");
const Discord = require("discord.js")
require("dotenv").config()
const { Client, Intents, MessageEmbed, ActivityType } = require("discord.js")
const client = new Client({
    fetchAllMembers: true,
    intents: 65535, // do not tamper
    ws: { properties: { $browser: "Discord iOS" || "Discord Desktop" } }
    

})

const { readdir , readdirSync } = require("fs")
const moment = require("moment")
const humanizeDuration = require("humanize-duration")
const Timeout = new Set()
client.slash = new Discord.Collection()
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const path = require("path")
const { keepalive } = require("./keepalive")
const commands = []
readdirSync("./commands/").map(async dir => {
    readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js')).map(async (cmd) => {
        commands.push(require(path.join(__dirname, `./commands/${dir}/${cmd}`)))
    })
})
const rest = new REST({ version: "10" }).setToken(process.env.token);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.botID),
            { body: commands }
        )
        console.log("ok")
    } catch (error) {
        console.error(error)
    }
})();

["slash", "anticrash" ].forEach(handler => {
    require(`./handlers/${handler}`)(client)
})


console.log(` ${client.guilds.cache.size} servers`)
console.log(` ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users`)
client.settings = new Enmap({name: "settings"});
client.on("ready", () => {
    console.log("\x1b[34m%s\x1b[0m", `Logged in as ${client.user.tag}!`)
    console.log("new values for user and servers")
    console.log(` ${client.guilds.cache.size} servers`)
    console.log(` ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users`)

 
    
    

    const activities_list = [
        { type: ActivityType.Watching,  browser: "DISCORD JS", message:  ` ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users` },
        { type: ActivityType.Listening, browser: "DISCORD JS", message: 'pings' },
        { type: ActivityType.Listening, browser: "Discord iOS", message: "Spotify"},
        { type: ActivityType.Competing, browser: "DISCORD JS", message: 'whitelist bingo'},
        { type: ActivityType.Watching, browser: "DISCORD JS", message: 'swagpex hub'}
    ];
    let index = 0
    setInterval(() => {
        if (index === activities_list.length) index = 0
        const status = activities_list[index]

        client.user.setPresence({
            activities: [{ name: `${status.message}`, type: status.type  }]

        })
        index++
        console.log("Changing Status!")
    }, 30000);
});


client.on("messageCreate", async (message) => {
    if (message.attachments.first() !== undefined && message.content !== "") {
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) messaged in ${message.channel.id}: ${message.content}`)
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) sent an attachment in ${message.channel.id}: ${message.attachments.first().url}`)
    } else if (message.attachments.first() !== undefined && message.content === "") {
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) sent an attachment in ${message.channel.id}: ${message.attachments.first().url}`)
    } else if (message.attachments.first() === undefined && message.content !== "") {
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) messaged in ${message.channel.id}: ${message.content}`)
    } else {
        if (message.embeds.length !== 0) {
            const a = message.embeds[0]
            const embed = {}
            for (const b in a) {
                if (a[b] != null && (a[b] !== [] && a[b].length !== 0) && a[b] !== {}) {
                    embed[b] = a[b]
                }
            }
            console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) sent an embed in ${message.channel.id}: ${JSON.stringify(embed, null, 2)}`)
        }
    }
})
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
        if (!client.slash.has(interaction.commandName)) return
        if (!interaction.guild) return
        const command = client.slash.get(interaction.commandName)
        try {
            if (command.timeout) {
                if (Timeout.has(`${interaction.user.id}${command.name}`)) {
                    return interaction.reply({ content: `You need to wait **${humanizeDuration(command.timeout, { round: true })}** to use command again`, ephemeral: true })
                }
            }
            if (command.permissions) {
                if (!interaction.member.permissions.has(command.permissions)) {
                    return interaction.reply({ content: `:x: You need \`${command.permissions}\` to use this command`, ephemeral: true })
                }
            }
            command.run(interaction, client)
            Timeout.add(`${interaction.user.id}${command.name}`)
            setTimeout(() => {
                Timeout.delete(`${interaction.user.id}${command.name}`)
            }, command.timeout)
        } catch (error) {
            console.error(error)
            await interaction.reply({ content: ":x: There was an error while executing this command!", ephemeral: true })
        }

        client.sendEmbed = function(message, options){
            if (!options || !message) {
              client.logger.warn("You need to specify options to send an embed!");
              return;
            }
            const embed = new EmbedBuilder();
            Object.assign(embed, options);
            if (options.author) {
              embed.setAuthor(options.author.name, options.author.image, options.author.url)
            }
            if (options.footer) {
              embed.setFooter({ text: options.footer });
            }
            message.editReply({ embeds: [embed]});
          }
    }
})


keepalive()
if (!process.env.token) {
    console.error("[ERROR]", "Token not found please visit: https://discord.com/developers/application to get token")
    process.exit(0)
}
client.login(process.env.token)
process.on("SIGINT", () => {
    console.log("\x1b[36m%s\x1b[0m", "SIGINT detected, exiting...")
    process.exit(0)
})