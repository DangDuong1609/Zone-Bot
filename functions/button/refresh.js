const { useMainPlayer, useQueue } = require('discord-player');
const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const player = useMainPlayer();

module.exports.data = {
    name: 'refresh',
    type: 'button'
}

module.exports.execute = async (interaction) => {
    interaction.deferUpdate();
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
        return interaction.reply({ content: 'Không có bài hát đang chơi', ephemeral: true });
    }
    const player = client.functions.get('player');
    queue.metadata.mess.edit(player);
}