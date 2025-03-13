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
            const query = interaction.options.getString('query', true);
            const searchResult = await player.search(query, {
                requestedBy: interaction.user,
                fallbackSearchEngine: 'youtube'
            });

            if (!searchResult.hasTracks()) {
                await interaction.reply(`Không tìm thấy bài hát nào cho: ${query}!`);
                return;
            }

            await player.play(interaction.member.voice.channel, searchResult.tracks[0], {
                nodeOptions: {
                    metadata: interaction.channel,
                },
            });

            await interaction.reply({ content: `Đang phát: ${searchResult.tracks[0].title}` });
        } catch (error) {
            console.error('Lỗi khi phát nhạc:', error);
            await interaction.reply({ content: 'Có lỗi xảy ra khi phát nhạc!', ephemeral: true });
        }
    },
    async autocomplete(interaction) {
        try {
            const query = interaction.options.getString('query', true);
            const results = await player.search(query, {
                requestedBy: interaction.user,
                fallbackSearchEngine: 'youtube'
            });

            return interaction.respond(
                results.tracks.slice(0, 10).map(track => ({
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


// module.exports.data = {
//     name: 'play',
//     description: 'Phát nhạc từ YouTube hoặc SoundCloud',
//     type: 'autocomplate'
// }

// module.exports.execute = async (interaction) => {
//     try {
//         const query = interaction.options.getString('query', true);
//         const results = await player.search(query, {
//             fallbackSearchEngine: 'youtube'
//         });        

//         return interaction.respond(
//             results.tracks.slice(0, 10).map(track => ({
//                 name: track.title,
//                 value: track.url
//             }))
//         );
//     } catch (e) {
//         return interaction.respond();
//     }
// }