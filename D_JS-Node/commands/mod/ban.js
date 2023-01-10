const { ApplicationCommandInteractionOptionResolver, Message, MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js')

const deletemsgs = [
	{ name: "None", value: 0 },
	{ name: "All", value: 7 },
]

module.exports = {
    name: 'ban',
    description: '[ADMIN] Bans a selected user',
    timeout: 10000,
    permissions: 'ADMINISTRATOR',
    options: [
        {
            name: "member",
            description: "Who you wanna perm-ban?",
            type: 6,
            required: true
        },
        {
            name: "messages",
            description: "How many messages to be deleted? (Max 7 days).",
            type: 10,
            choices: deletemsgs,
            required: true
        },
        {
            name: "reason",
            description: "Insert Reason here.",
            type: 3,
            required: false
        }
    ],


run: async (interaction, client) => {
    let user = interaction.options.getUser('member');
    let reason = interaction.options.getString('reason')
    let DELETION = interaction.options.getNumber('messages')


    const member = await interaction.guild.members.fetch(user.id);
    if (!member) return await interaction.reply('Invalid user you FATASS');
    if (!reason) reason = `Nothing was specified.`;

    const lmaooembed = new MessageEmbed()
    .setTitle(`You've been banned.`)
    .setColor('DARK_RED')
    .setDescription(`RIP BOZO`)
    .addField(`Reason`, `${reason}`)
    .addField(`Moderator`, `${interaction.user.username}#${interaction.user.discriminator}` )
    .addField(`InteractionID`, `${interaction.id}`)
    .setTimestamp();

    const confirmation = new MessageEmbed()
    .setTitle(`User has been BANGARANGED!!!?!`)
    .setColor('DARK_RED')
    .setDescription(`${member} has been BANNED  for ${reason}`)
    .addField(`Reason`, `${reason}`)
    .addField(`Moderator`, `${interaction.user.username}#${interaction.user.discriminator}` )
    .addField(`InteractionID`, `${interaction.id}`)
    .setTimestamp()


    let logreason = `${interaction.user.username}#${interaction.user.discriminator} has BANNED ${member.user.username}#${member.user.discriminator} for ${reason}.`

    try{
        await member.send({embeds: [lmaooembed]});
        await member.ban({ days: `${DELETION}`, reason:` ${logreason}`})
        await interaction.reply({ embeds: [confirmation]});
    } catch (error){
        await interaction.reply({content:`${member.user.username}#${member.user.discriminator}'s dms are off , banning user anyways`, ephemeral: true})
        await member.ban({ days: `${DELETION}`, reason:` ${logreason}`})
        await interaction.reply({ embeds: [confirmation]});

    }
},
};