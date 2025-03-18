const { useMainPlayer, useQueue } = require('discord-player');
const player = useMainPlayer();

module.exports.data = {
    name: 'next',
    type: 'button'
}

module.exports.execute = async (interaction) => {
    interaction.deferUpdate();
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
        return interaction.reply({ content: 'Không có bài hát đang chơi', ephemeral: true });
    }
    queue.node.skip();
    return interaction.reply({ content: 'Đã chuyển bài hát', ephemeral: true });
}