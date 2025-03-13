const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'audioTrackAdd',
    execute(queue, track) {
        const tracks = track.tracks.data[0];

        // Check if metadata and channel are defined
        if (!track.metadata?.channel) {
            console.error('Metadata or channel is undefined:', track.metadata);
            return;
        }

        // Ensure all fields have valid values
        const duration = tracks.duration || 'Không xác định'; // Fallback for undefined duration
        const requestedBy = track.metadata.requestedBy?.toString() || 'Ẩn danh'; // Fallback for undefined requester

        // Send the embed to the channel
        track.metadata.channel.send({
            embeds: [{
                color: 0x3d8f58,
                title: '🎵 Đã thêm vào hàng đợi',
                description: `**[${tracks.title}](${tracks.url})**`,
                thumbnail: {
                    url: tracks.thumbnail
                },
                fields: [
                    {
                        name: '⏳ Thời lượng',
                        value: duration, // Use the fallback value
                        inline: true
                    },
                    {
                        name: '📤 Yêu cầu bởi',
                        value: requestedBy, // Use the fallback value
                        inline: true
                    }
                ],
                footer: {
                    text: `Yêu cầu bởi ${track.metadata.requestedBy?.username || "Ẩn danh"}`,
                    iconURL: track.metadata.requestedBy?.displayAvatarURL({ size: 1024 })
                }
            }]
        });
    }
};