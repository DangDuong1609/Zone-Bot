const { useMainPlayer, useQueue } = require('discord-player');
const player = useMainPlayer();

module.exports.data = {
    name: 'pause',
    type: 'button'
}

module.exports.execute = async (interaction) => {
    interaction.deferUpdate();
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
        return interaction.reply({ content: 'Không có bài hát đang chơi', ephemeral: true });
    }

    queue.node.setPaused(queue.isPlaying());
    const player = client.functions.get('player');
    queue.metadata.mess.edit(player);
}