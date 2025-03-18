const config = require('../config');

module.exports = {
    name: 'playerStart',
    execute: async (client, queue, track) => {
        try {
            const player = client.functions.get("player");
            if (!player) {
                console.error("❌ Không tìm thấy player function.");
                return;
            }

            const res = await player.execute(client, queue, track);
            if (queue.metadata?.mess) {
                await queue.metadata.mess.edit(res).catch(err => console.error("❌ Lỗi khi chỉnh sửa tin nhắn:", err));
            }

            // Kiểm tra metadata và channel trước khi gửi tin nhắn
            if (!queue.dispatcher?.channel) {
                console.error('❌ Metadata hoặc channel bị undefined:', track.metadata);
                return;
            }

            // if (track.playlist.player.client.channels) {
            //     console.log('✅ Channels đã được định nghĩa.');
            // } else {
            //     console.error('❌ Channels chưa được định nghĩa.');
            // }

            // console.log('channels: ', track.playlist.player.client.channels);

            const duration = track.duration || 'Không xác định';

            // Gửi thông báo bài hát mới vào kênh
            queue.dispatcher.channel.send({
                embeds: [{
                    color: 0x3d8f58,
                    title: '🎵 Đang phát:',
                    description: `**[${track.title}](${track.url})**`,
                    thumbnail: { url: track.thumbnail },
                    fields: [
                        { name: '⏳ Thời lượng', value: duration, inline: true }
                    ],
                }]
            }).catch(err => console.error("❌ Lỗi khi gửi tin nhắn:", err));
        } catch (error) {
            console.error("❌ Lỗi trong playerStart:", error);
        }
    },
};