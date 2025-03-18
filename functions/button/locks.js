const { useMainPlayer, useQueue } = require('discord-player');
const player = useMainPlayer();

module.exports.data = {
    name: 'locks',
    type: 'button'
}

module.exports.execute = async (interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
        return interaction.reply({ content: 'Không có bài hát đang chơi', ephemeral: true });
    }
}