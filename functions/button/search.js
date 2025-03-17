const { useMainPlayer, useQueue } = require('discord-player');
const player = useMainPlayer();

module.exports.data = {
    name: 'search',
    type: 'button'
}

module.exports.execute = async (interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
        return interaction.reply({ content: 'Không có bài hát đang chơi', ephemeral: true });
    }
    const modal = new ModalBuilder()
        .setTitle('Search')
        .setCustomId('search-modal')
        .addComponents(
            new TextInputBuilder()
            .setCustomId('search')
            .setLabel('Search')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        );
    await interaction.showModal(modal);
    return;
}