const { Events, MessageFlags, PermissionsBitField } = require('discord.js');
const config = require('../config.json');

module.exports.name = Events.InteractionCreate;
module.exports = {
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`❌ Không tìm thấy lệnh: ${interaction.commandName}`);
                return;
            }

            try {
                // Kiểm tra bot có quyền gửi tin nhắn không
                if (!interaction.channel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.SendMessages)) {
                    return console.error('🚫 Bot không có quyền gửi tin nhắn trong kênh này.');
                }
                
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                const errorMessage = `❌ Đã xảy ra lỗi: ${error.message}`;
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: errorMessage, flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: errorMessage, flags: MessageFlags.Ephemeral });
                }
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command || !command.autocomplete) {
                console.error(`❌ Không tìm thấy autocomplete cho lệnh: ${interaction.commandName}`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(`❌ Lỗi trong autocomplete: ${error.message}`);
            }
        }
    },
};
