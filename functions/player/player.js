const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const emoji = {
    volume: '🔊',
    previous: '⏮️',
    pause: '⏸️',
    play: '▶️',
    next: '⏭️',
    loop: '🔂',
    search: '🔍',
    locks: '🔒',
    unlocks: '🔓',
    stop: '⏹️',
    shuffle: '🔀',
    refresh: '🔄'
};

const CreateButton = ({ id, label = null, style = ButtonStyle.Secondary, emoji = null, disabled = true }) => {
    const button = new ButtonBuilder()
        .setCustomId(`player_${id}`)
        .setStyle(style)
        .setDisabled(disabled);
    if (label) button.setLabel(label);
    if (emoji) button.setEmoji(emoji);
    return button;
};

const repeatMode = ["OFF", "TRACK", "QUEUE", "AUTOPLAY"];

module.exports = {
    data: {
        name: 'player',
        type: 'player'
    },
    execute: async (client, queue, tracks) => {
        const track = tracks ?? queue.currentTrack;
        if (!track) {
            return { content: "⚠ Không có bài hát nào đang phát!", ephemeral: true };
        }

        const requestedBy = tracks?.requestedBy ?? queue.metadata?.requestedBy ?? { username: "Ẩn danh", displayAvatarURL: () => null };

        const embed = new EmbedBuilder()
            .setColor(0x3d8f58)
            .setTitle('🎵 Đang phát')
            .setDescription(`**[${track.title}](${track.url})**`)
            .setTimestamp()
            .setImage(track.thumbnail)
            .setFooter({
                text: `Yêu cầu bởi ${requestedBy.username}`,
                iconURL: requestedBy.displayAvatarURL({ size: 1024 })
            });

        if (queue.repeatMode !== 0) {
            embed.addFields({
                name: `🔁 Lặp lại: ${repeatMode[queue.repeatMode]}`,
                value: " ",
                inline: false
            });
        }

        // Kiểm tra xem có đang phát hay không
        let progressBar = queue.node.createProgressBar();
        if (progressBar) {
            embed.addFields({ name: progressBar, value: " " });
        }

        let buttons = [];
        if (queue.node.isPlaying()) {
            buttons.push(new ActionRowBuilder().addComponents(
                CreateButton({ id: 'volume', emoji: emoji.volume, disabled: false }),
                CreateButton({ id: 'previous', emoji: emoji.previous, disabled: !queue.history?.previousTrack }),
                CreateButton({ id: 'pause', emoji: queue.node.isPlaying() ? emoji.pause : emoji.play, disabled: false }),
                CreateButton({ id: 'next', emoji: emoji.next, disabled: false }),
                CreateButton({ id: 'loop', emoji: emoji.loop, disabled: false })
            ));

            buttons.push(new ActionRowBuilder().addComponents(
                CreateButton({ id: 'refresh', emoji: emoji.refresh, disabled: false }),
                CreateButton({ id: 'shuffle', emoji: emoji.shuffle, disabled: queue.tracks.length === 0 }),
                CreateButton({ id: 'search', emoji: emoji.search, disabled: false }),
                CreateButton({ id: 'locks', emoji: emoji.locks, disabled: false }),
                CreateButton({ id: 'stop', style: ButtonStyle.Danger, emoji: emoji.stop, disabled: false })
            ));
        }

        return { embeds: [embed], components: buttons };
    },
};