const { useMainPlayer, useQueue } = require('discord-player');
const player = useMainPlayer();

module.exports.data = {
    name: 'loop',
    type: 'button'
}

module.exports.execute = async (interaction) => {
    interaction.deferUpdate();
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
        return interaction.reply({ content: 'Không có bài hát đang chơi', ephemeral: true });
    }

    if (queue.repeatMode === 0) {
        queue.setRepeatMode(1);
        // return interaction.reply({ content: 'Đã bật loop', ephemeral: true });
    } else if (queue.repeatMode === 1) {
        queue.setRepeatMode(2);
        // return interaction.reply({ content: 'Đã bật loop toàn bộ', ephemeral: true });
    } else if (queue.repeatMode === 2) {
        queue.setRepeatMode(0);
        // return interaction.reply({ content: 'Đã tắt loop', ephemeral: true });
    }

    const player = client.functions.get('player');
    // queue.metadata.message.edit({
    //     embeds: [player.execute(interaction)]
    // });
    queue.metadata.mess.edit(player);
}