const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Hiển thị avatar của người dùng')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Chọn người dùng')
                .setRequired(false)
        ),
    help: { 
        name: "avatar"
    },
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        await interaction.reply(user.displayAvatarURL({ size: 1024 }));
    },
};