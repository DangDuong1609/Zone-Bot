const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Shows how long the bot has been online'),

    async execute(interaction) {
        const uptime = interaction.client.uptime;

        // Convert milliseconds to a readable format
        const seconds = Math.floor((uptime / 1000) % 60);
        const minutes = Math.floor((uptime / (1000 * 60)) % 60);
        const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        await interaction.reply({ content: `🕒 **Bot Uptime:** ${uptimeString}`, ephemeral: false });
    },
};
