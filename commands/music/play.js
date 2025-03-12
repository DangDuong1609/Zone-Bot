const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

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
        if (!voiceChannel) {
            return interaction.reply('Vui lòng tham gia vào kênh thoại trước!');
        }

        const voiceMe = interaction.guild.members.cache.get(interaction.client.user.id)?.voice.channel;
        if (voiceMe && voiceMe.id !== voiceChannel.id) {
            return interaction.reply('Vui lòng tham gia vào kênh thoại cùng với tôi!');
        }

        const player = useMainPlayer();
        await interaction.deferReply({ fetchReply: true });
        const queue = useQueue(interaction.guild.id);

        const res = await player.play(voiceChannel, query, {
            nodeOptions: {
                selfDeaf: true,
                volume: 100,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 5000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 500000,
                metadata: queue?.metadata || {
                    channel: interaction.channel,
                    requestBy: interaction.user,
                    mess: queue?.metadata?.mess || await interaction.client.fetchReply(interaction)
                }
            }
        });

        if (queue?.metadata) return interaction.deleteReply().catch(() => { });
        await interaction.editReply(`Đã thêm bài hát: ${res.track.title}`);
    },
};
