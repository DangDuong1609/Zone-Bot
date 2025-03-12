const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Phát nhạc')
        .addStringOption(option =>  // ✅ Fixed: addStringOption instead of addUserOption
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
        if (!voiceChannel) return interaction.reply('Vui lòng tham gia vào kênh thoại trước!');

        const voiceMe = interaction.guild.members.cache.get(interaction.client.user.id)?.voice.channel;
        if (voiceMe && voiceMe.id !== voiceChannel.id) return interaction.reply('Vui lòng tham gia vào kênh thoại cùng với tôi!');

        // const reply = await interaction.fetchReply();
        await interaction.reply(`Now playing: ${query}`);

        const queue = useQueue(interaction.guild.id); // ✅ Fixed: useQueue instead of useMainPlayer

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

            // Ensure the track has a duration
            if (!res.track.duration) {
                res.track.duration = 'Không xác định';
            }

            if (queue?.metadata) return interaction.deleteReply().catch(e => { });
            await interaction.editReply(`Đã thêm bài hát: ${res.track.title}`);

        } catch (error) {
            if (error.code === 'ERR_NO_RESULT') {
                return interaction.editReply('❌ Không tìm thấy bài hát nào. Hãy thử một từ khóa khác.');
            }
            console.error(error);
            return interaction.editReply('❌ Đã xảy ra lỗi khi phát nhạc.');
        }
    },
};
