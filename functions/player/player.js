const { useQueue } = require('discord-player');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const CreateButton = ({ id = null, label = null, style = ButtonStyle.Secondary, emoji = null, disabled = true }) => {
    const button = new ButtonBuilder()
        .setCustomId(`player_${id}`)
        .setStyle(style)
        .setDisabled(disabled);
    if (label) button.setLabel(label);
    if (emoji) button.setEmoji(emoji);
    return button;
}

module.exports = {
    data: {
        name: 'player',
        type: 'player'
    },
    execute: async (client, queue, tracks) => {
        const track = tracks ?? queue.currentTrack;
        const requestedBy = tracks?.requestedBy ?? queue.metadata.requestedBy;
        let code = {};

        const process = queue.node.createProgressBar({
            // format: '▬',
            // progress: '▬',
            // timecodes: true
        });

        const embed = new EmbedBuilder()
            .setColor(0x3d8f58)
            .setTitle('🎵 Đã thêm vào hàng đợi')
            .setDescription(`**[${track.title}](${track.url})**`)
            .setTimestamp()
            .setImage(track.thumbnail)
            .addFields({
                    name: `${process}`,
                    value: " ",
                })
            .setFooter({
                text: `Yêu cầu bởi ${requestedBy.username || "Ẩn danh"}`,
                iconURL: requestedBy.displayAvatarURL({ size: 1024 })
            });

        code.embeds = [embed];

        if (queue.node.isPlaying() || !queue.isEmpty()) {
            const button_001 = new ActionRowBuilder().addComponents(
                CreateButton({
                    id: 'prev',
                    emoji: '⏮️',
                    disabled: !queue?.history?.previousTrack
                }),
                CreateButton({
                    id: 'pause',
                    emoji: `${queue.node.isPlaying() ? '⏸️' : '▶️'}`,
                    disabled: !queue?.history?.isPaused
                }),
                CreateButton({
                    id: 'next',
                    emoji: '⏭️',
                    disabled: false
                }),
                CreateButton({
                    id: 'loop',
                    emoji: '🔂',
                    disabled: false
                })
            );
            
            const button_002 = new ActionRowBuilder().addComponents(
                CreateButton({
                    id: 'search',
                    emoji: '🔍',
                    disabled: false
                }),
                CreateButton({
                    id: 'volume',
                    emoji: '🔊',
                    disabled: false
                }),
                CreateButton({
                    id: 'locks',
                    emoji: '🔒',
                    disabled: false
                }),
                CreateButton({
                    id: 'stop',
                    style: ButtonStyle.Danger,
                    emoji: '⏹️',
                    disabled: false
                })
            );
            code.components = [button_001, button_002];
        }
        return code;
    },
};