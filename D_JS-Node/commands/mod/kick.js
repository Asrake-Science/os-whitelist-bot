const { ApplicationCommandInteractionOptionResolver, Message, MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
    name: 'kick',
    description: '[ADMIN] Kick someone for breaking the rules',
    timeout: 10000,
    permissions: 'ADMINISTRATOR',
    options: [
        {
            name: "member",
            description: "Who you wanna kick?",
            type: 6,
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



    const member = await interaction.guild.members.fetch(user.id);
    if (!member) return await interaction.reply('Invalid user');
    if (!reason) reason = `Nothing was specified.`;

    const lmaooembed = new MessageEmbed()
    .setTitle(`You've been kicked.`)
    .setColor('DARK_RED')
    .setDescription(`don't worry, you can rejoin!`)
    .addField(`Reason`, `${reason}`)
    .addField(`Moderator`, `${interaction.user.username}#${interaction.user.discriminator}` )
    .addField(`InteractionID`, `${interaction.id}`)
    .setTimestamp();

    const confirmation = new MessageEmbed()
    .setTitle(`User has been kicked!`)
    .setColor('DARK_RED')
    .setDescription(`${member} has been kicked out for ${reason}`)
    .addField(`Reason`, `${reason}`)
    .addField(`Moderator`, `${interaction.user.username}#${interaction.user.discriminator}` )
    .addField(`InteractionID`, `${interaction.id}`)
    .setTimestamp()

    let logreason = `${interaction.user.username}#${interaction.user.discriminator} has kicked out ${member.user.username}#${member.user.discriminator} for ${reason}.`

    try{
        await member.send({embeds: [lmaooembed]});
        await member.kick(`${logreason}`)
        await interaction.reply({ embeds: [confirmation]});
    } catch (error){
        console.log(`${member.user.username}#${member.user.discriminator}'s dms are off`)
        await member.kick(`${logreason}`)
        await interaction.reply({ embeds: [confirmation]});
    }
},
};