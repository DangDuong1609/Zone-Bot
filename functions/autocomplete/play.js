const { useMainPlayer } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Phát nhạc từ YouTube hoặc SoundCloud')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Tên bài hát hoặc URL')
                .setRequired(true)
                .setAutocomplete(true)),
    async execute(interaction) {
        try {
            // Kiểm tra người dùng có ở trong kênh thoại không
            const voiceChannel = interaction.member.voice.channel;

            console.log('voiceChannel', voiceChannel);

            if (!voiceChannel) {
                return await interaction.reply({ content: 'Bạn cần tham gia một kênh thoại để phát nhạc!', ephemeral: true });
            }

            const query = interaction.options.getString('query', true);
            await interaction.deferReply(); // Tránh lỗi gửi phản hồi 2 lần

            const searchResult = await player.search(query, {
                requestedBy: interaction.user,
                fallbackSearchEngine: 'youtubePlaylist'
            });

            console.log('searchResult', searchResult);


            if (!searchResult.tracks.length) {
                return await interaction.editReply(`Không tìm thấy bài hát nào cho: ${query}!`);
            }

            await player.play(voiceChannel, searchResult.tracks[0], {
                nodeOptions: { metadata: interaction.channel }
            });

            await interaction.editReply({ content: `🎵 Đang phát: **${searchResult.tracks[0].title}**` });

        } catch (error) {
            console.error('Lỗi khi phát nhạc:', error);
            await interaction.editReply({ content: '❌ Có lỗi xảy ra khi phát nhạc!', ephemeral: true });
        }
    },
    async autocomplete(interaction) {
        try {
            const query = interaction.options.getString('query', true);
            if (!query) return;
            
            const results = await player.search(query, {
                fallbackSearchEngine: 'youtubePlaylist'
            });

            const tracks = results.tracks.slice(0, 10);
            if (!tracks.length) return;

            return interaction.respond(
                tracks.map(track => ({
                    name: track.title,
                    value: track.url
                }))
            );
        } catch (error) {
            console.error('Lỗi khi autocomplete:', error);
            return interaction.respond([]);
        }
    }
};