const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Resends your text')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text you want to say')
                .setRequired(true)),
    
    async execute(interaction) {
        const text = interaction.options.getString('text');
        await interaction.reply({ content: text, ephemeral: false }); // Change `ephemeral: true` if you want it visible only to the user
    },
};
