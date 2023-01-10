const { guild, ApplicationCommandInteractionOptionResolver, Message, MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js')
const Discord = require("discord.js")
const fs = require('fs');

module.exports = {
    name: 'whitelist',
    description: 'Manage the script Whitelist',
    permissions: 'MANAGE_SERVER',
    timeout: 5000,
    options: [
        {
            name: "add",
            description: "Add a user to the whitelist",
            type: 1,
            options: [
                {
                    name: "person",
                    description: "The user to add to the whitelist",
                    type: 6,
                    required: true
                }]
        },
        {
            name: "remove",
            description: "Remove a user from the whitelist",
            type: 1,
            options: [
                {
                    name: "person",
                    description: "The user to remove from the whitelist",
                    type: 6,
                    required: true
                }]
        },
        {
            name: "list",
            description: "List the users on the whitelist",
            type: 1
        },
        {
            name: "resethwid",
            description: "Reset the HWID for a user",
            type: 1,
            options: [
                {
                    name: "person",
                    description: "The user to reset the HWID for",
                    type: 6,
                    required: true
                }]
        },
    ],

    /**
     * 
     * @param {Message} message
     * @param {string} args
     * @param {ApplicationCommandInteractionOptionResolver} interaction.options
     */

    run: async (interaction, client) => {
        if (interaction.options.getSubcommand() === 'add') {
            const user = interaction.options.getUser('person');
            const guild = interaction.guild;
            let uid = user.id

            console.log(user.id)
            const result = addUserToWhitelist(user.id);
            if ('error' in result) {
                await interaction.reply(result.error);
            } else {
                const role = interaction.guild.roles.cache.find(r => r.name === 'Buyer');
                const member = await guild.members.fetch(uid);
                await member.roles.add(role, `Proud owner of swagpex hub [PAID-${user.id}].`);
                await interaction.reply(`<@${user.id}> has been added to the whitelist and given the ${role.name} role.`);
            }
        } else if (interaction.options.getSubcommand() === 'remove') {
            const user = interaction.options.getUser('person');
            const guild = interaction.guild;
            let uid = user.id

            console.log(user.id)
            const result = removeUserFromWhitelist(user.id);
            if ('error' in result) {
                await interaction.reply(result.error);
            } else {
                // Get the role you want to remove from the user
                const role = interaction.guild.roles.cache.find(r => r.name === 'Buyer');
                if (!role) {
                    await interaction.reply(`Error removing ${role.name} Role.`);
                    return;
                }
                // Remove the role from the user
                const member = await guild.members.fetch(uid);
                await member.roles.remove(role, "Lost Buyer Status.");
                await interaction.reply(result.success);
            }
        }



        else if (interaction.options.getSubcommand() === 'list') {
            const result = listWhitelistedUsers();
            if ('error' in result) {
                await interaction.reply(result.error);
            } else {
                const users = result.users;
                const page = result.page;
                const pages = result.pages;
                if (users.length === 0) {
                    await interaction.reply('There are no whitelisted users.');
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Whitelisted Users')
                        .setDescription(`Page ${page}/${pages}`)
                        .setColor(0x00AE86)
                        .setFooter(`Use "whitelist list" to view different pages.`);
                    for (const user of users) {
                        embed.addField(`${user.serial}.`, `<@${user.userid}>`);
                    }
                    await interaction.reply({ embeds: [embed] });
                }
            }
        } else if (interaction.options.getSubcommand() === 'resethwid') {
            const user = interaction.options.getUser('person');
            console.log(user.id);
            const result = resetHWID(user.id);
            if ('error' in result) {
                await interaction.reply(result.error);
            } else {
                await interaction.reply(result.success);
            }
        }
    }
}

function resetHWID(user_id) {
    try {
        const whitelist = JSON.parse(fs.readFileSync('whitelist.json'));
        const user = whitelist.hwids.find(x => x.userid === user_id);
        if (!user) {
            return { error: `Script Buyer: <@${user_id}> not found in whitelist.` };
        } else if (!user.id) {
            return { error: `Script Buyer: <@${user_id}> does not have a set HWID..` };
        } else {
            user.id = '';
            fs.writeFileSync('whitelist.json', JSON.stringify(whitelist, null, 4));
            return { success: `HWID for Script Buyer: <@${user_id}> has been reset.` };
        }
    } catch (error) {
        return { error: 'An error occurred while reading the whitelist.' };
    }
}

function addUserToWhitelist(user_id) {
    try {
        const whitelist = JSON.parse(fs.readFileSync('whitelist.json'));
        const user = whitelist.hwids.find(x => x.userid === user_id);
        if (user) {
            return { error: `<@${user_id}> is already whitelisted!` };
        }

        let serial = 1;
        let found = true;
        while (found) {
            found = false;
            for (const hwid of whitelist.hwids) {
                if (hwid.serial === serial) {
                    serial++;
                    found = true;
                    break;
                }
            }
        }

        const new_user = {
            id: '',
            serial: serial,
            userid: user_id,
            scriptKey: null
        };
        whitelist.hwids.push(new_user);
        fs.writeFileSync('whitelist.json', JSON.stringify(whitelist, null, 4));
        return { success: `<@${user_id}> has been added to the whitelist!` };
    } catch (err) {
        console.error(err);
        return { error: 'An error occurred while adding the user to the whitelist.' };
    }
}

function removeUserFromWhitelist(user_id) {
    try {
        const whitelist = JSON.parse(fs.readFileSync('whitelist.json'));
        const index = whitelist.hwids.findIndex(x => x.userid === user_id);
        if (index === -1) {
            return { error: 'This user is not whitelisted!' };
        }

        whitelist.hwids.splice(index, 1);
        fs.writeFileSync('whitelist.json', JSON.stringify(whitelist, null, 4));
        return { success: 'User successfully removed from the whitelist.' };
    } catch (err) {
        console.error(err);
        return { error: 'An error occurred while removing the user from the whitelist.' };
    }
}

function listWhitelistedUsers() {
    try {
        const whitelist = JSON.parse(fs.readFileSync('whitelist.json'));
        const sortedhwids = whitelist.hwids.sort((a, b) => a.serial - b.serial);
        const page = 1;
        const itemsPerPage = 10;
        const pages = Math.ceil(sortedhwids.length / itemsPerPage);
        return {
            users: sortedhwids.slice((page - 1) * itemsPerPage, page * itemsPerPage),
            page: page,
            pages: pages
        };
    } catch (error) {
        return {
            error: 'An error occurred while reading the whitelist.'
        };
    }
}