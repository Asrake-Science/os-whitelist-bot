const { ApplicationCommandInteractionOptionResolver, Message, MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js')
const durations = [
	{ name: "60 seconds", value: 60 * 1000 },
	{ name: "5 minutes", value: 5 * 60 * 1000 },
	{ name: "10 minutes", value: 10 * 60 * 1000 },
	{ name: "30 minutes", value: 30 * 60 * 1000 },
	{ name: "1 hour", value: 60 * 60 * 1000 },
	{ name: "1 day", value: 24 * 60 * 60 * 1000 },
	{ name: "1 week", value: 7 * 24 * 60 * 60 * 1000 }
]

module.exports = {
    name: 'mute',
    description: '[ADMIN] Put someone in timeout',
    timeout: 10000,
    permissions: 'ADMINISTRATOR',
    options: [
        {
            name: "member",
            description: "Who you wanna temporarily exile?",
            type: 6,
            required: true
        },
        {
            name: "time",
            description: "Duration of the timeout",
            type: 10,
            choices: durations,
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
    let duration = interaction.options.getNumber('time');
    let reason = interaction.options.getString('reason')



    const member = await interaction.guild.members.fetch(user.id);
    if (!member) return await interaction.reply('Invalid user you FATASS');
    if (!duration) return await interaction.reply('Bruuuh duration invalid, remember its in MINUTES!!!!!!');
    if (!reason) reason = `Nothing was specified.`;

    const lmaooembed = new MessageEmbed()
    .setTitle(`You've been timed out.`)
    .setColor('DARK_RED')
    .setDescription(`This is not a major punishment, it just means you are not able to do anything for a while`)
    .addField(`Duration of the timeout`, `${durations.find(d=> duration === d.value)?.name}.`)
    .addField(`Reason`, `${reason}`)
    .addField(`Moderator`, `${interaction.user.username}#${interaction.user.discriminator}` )
    .addField(`InteractionID`, `${interaction.id}`)
    .setTimestamp();

    const confirmation = new MessageEmbed()
    .setTitle(`Uh oh!!!`)
    .setColor('NAVY')
    .setDescription(`${member} has been timed out for ${durations.find(d=> duration === d.value)?.name}`)
    .setTimestamp()

    let logreason = `${interaction.user.username} has timed out ${member.user.username} for ${reason}.`

    try{
        await member.timeout(duration, logreason)
        await interaction.reply({ embeds: [confirmation]});
        await member.send({embeds: [lmaooembed]});
    } catch (error){
        console.log(`${member.user.username}#${member.user.discriminator}'s dms are off`)
        await member.timeout(duration, logreason)
        await interaction.reply({ embeds: [confirmation]});
    }
},
};