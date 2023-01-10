const { ApplicationCommandInteractionOptionResolver, Message, MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js')
const Discord = require('discord.js')
const fs = require('fs');

thingymabob = "```"

module.exports = {
    name: "getkey",
    description: "Gives the user a script key if they are whitelisted.",
    timeout: 5000,
    run: async (interaction, client) => {
        const user = interaction.user;
        const result = addScriptKeyToWhitelist(user.id);
        const tosend = await interaction.guild.members.fetch(user.id);
        if ('error' in result) {
            await interaction.reply(result.error);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle('swagpex hub')
                .setDescription(`${thingymabob}lua\n_G.Key = "${result.key}"\nloadstring(game:HttpGet("https://wls.swagpex.net/loader"))()\n${thingymabob}`)
                .setColor(0x00AE86)
                .setFooter(`Whitelist System created by supexian`)
                .setTimestamp();
            await tosend.send({ embeds: [embed] });
            await interaction.reply({content: "I have DM'ed you the key.", ephemeral: true})
        }
    }
};

function addScriptKeyToWhitelist(user_id) {
    try {
        const whitelist = JSON.parse(fs.readFileSync('whitelist.json'));
        const user = whitelist.hwids.find(x => x.userid === user_id);
        if (!user) {
            return {
                error: 'This user is not whitelisted.'
            };
        } else if (user.scriptKey) {
            return {
                error: 'This user already has a script key.'
            };
        } else {
            const key = generateScriptKey();
            user.scriptKey = key;
            fs.writeFileSync('whitelist.json', JSON.stringify(whitelist,null, 4));
            return {
                success: `A new key has been added for <@${user.userid}>: ${key}`,
                key: `${key}`
            };
        }
    } catch (error) {
        return {
            error: 'An error occurred while reading the whitelist.'
        };
    }
}


function generateScriptKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 4; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    key += '-';
    for (let i = 0; i < 5; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    key += '-';
    for (let i = 0; i < 5; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    key += '-';
    for (let i = 0; i < 3; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}