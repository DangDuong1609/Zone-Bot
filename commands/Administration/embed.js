const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Sends an embedded message')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('Title of the embed')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('description')
                .setDescription('Description of the embed')
                .setRequired(true)),
    
    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: 'Embed created by ' + interaction.user.tag });

        await interaction.reply({ embeds: [embed] });
    },
};