const { ApplicationCommandInteractionOptionResolver, Message, MessageActionRow, MessageButton, EmbedBuilder, Permissions } = require('discord.js')
const Discord = require('discord.js')
const fs = require('fs');
const path = require('path')
const whitelistjson = path.resolve("../whitelist.json")

thingymabob = "```"

module.exports = {
    name: "sendkey",
    description: "Gives the user a script key if they are whitelisted.",
    permissions: 'MANAGE_SERVER',
    timeout: 5000,
    options: [
        { 
            name: "user",
            description: "The user to send the key to.",
            type: 6,
            required: true
        }
    ],

    run: async (interaction, client) => {
        let user = interaction.options.getUser('user');
        const result = addScriptKeyToWhitelist(user.id);
        if ('error' in result) {
            await interaction.reply(result.error);
        } else {
            const embed = new EmbedBuilder()
                .setTitle('swagpex auth')
                .setDescription(`${thingymabob}lua\n_G.Key = "${result.key}"\nloadstring(game:HttpGet("https://your-domain.xyz/loader"))()\n${thingymabob}`)
                .setColor(0x00AE86)
                .setFooter({ text: `Whitelisted by ${interaction.user.username}${interaction.user.discriminator}, dm them if you're experiencing issues.`, iconURL: 'https://cdn.discordapp.com/attachments/1043863259859660819/1062739548649574481/ambasing.png' })
                .setTimestamp();
            await interaction.reply(result.success)
            await user.send({ embeds: [embed] });
        }
    }
};

function addScriptKeyToWhitelist(user_id) {
    try {
        const whitelist = JSON.parse(fs.readFileSync(whitelistjson));
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
            fs.writeFileSync(whitelistjson, JSON.stringify(whitelist,null, 4));
            return {
                success: `A new key has been added for <@${user.userid}>`,
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