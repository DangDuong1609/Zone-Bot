const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the bot\'s latency'),

    async execute(interaction) {
        const ping = Math.round(interaction.client.ws.ping);
        await interaction.reply({ content: `🏓 Pong! Latency is **${ping}ms**.`, ephemeral: false });
    },
};
