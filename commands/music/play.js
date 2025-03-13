const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Phát nhạc')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Tên nhạc')
                .setRequired(true)
        ),
    help: {
        name: "play"
    },
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply('❌ Vui lòng tham gia vào kênh thoại trước!');

        const voiceMe = interaction.guild.members.cache.get(interaction.client.user.id)?.voice.channel;
        if (voiceMe && voiceMe.id !== voiceChannel.id) return interaction.reply('❌ Vui lòng tham gia vào kênh thoại cùng với tôi!');

        await interaction.reply(`🔎 Đang tìm bài hát: **${query}**...`);

        const queue = useQueue(interaction.guild.id);

        try {
            const res = await player.play(voiceChannel, query, {
                nodeOptions: {
                    selfDeaf: true,
                    volume: 100,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 5000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 500000,
                    metadata: {
                        channel: interaction.channel,
                        requestedBy: interaction.user,
                        interaction: interaction
                    }
                }
            });

            // Đảm bảo track có thông tin duration hợp lệ
            const duration = res.track.duration || 'Không xác định';
            
            if (queue && queue.metadata) {
                return interaction.deleteReply().catch(() => {});
            }
            await interaction.editReply(`✅ Đã thêm vào danh sách phát: **${res.track.title}** (${duration})`);
        } catch (error) {
            console.error(error);
            const errorMessage = error.code === 'ERR_NO_RESULT' 
                ? '❌ Không tìm thấy bài hát nào. Hãy thử một từ khóa khác.'
                : `❌ Đã xảy ra lỗi: ${error.message}`;
            return interaction.editReply(errorMessage);
        }
    },
};