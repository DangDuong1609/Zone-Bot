const { useMainPlayer, useQueue, QueryType } = require("discord-player");
const { useFunctions, useConfig } = require("@zibot/zihooks");

const player = useMainPlayer();
const config = useConfig();

module.exports.data = {
	name: "play",
	description: "Phát nhạc",
	type: 1, // Slash command
	options: [
		{
			name: "next",
			description: "Thêm nhạc vào tiếp theo",
			type: 1, // Sub command
			options: [
				{
					name: "query",
					description: "Tên bài hát",
					required: true,
					type: 3,
					autocomplete: true,
				},
			],
		},
		{
			name: "assistant",
			description: "Thêm nhạc và điều khiển bằng giọng nói",
			type: 1, // Sub command
			options: [
				{
					name: "query",
					description: "Tên bài hát",
					required: true,
					type: 3,
					autocomplete: true,
				},
				{
					name: "focus",
					description: "Chỉ nghe lệnh người yêu cầu.",
					type: 5, // Boolean
				},
			],
		},
		{
			name: "music",
			description: "Phát nhạc",
			type: 1, // Sub command
			options: [
				{
					name: "query",
					description: "Tên bài hát",
					required: true,
					type: 3,
					autocomplete: true,
				},
			],
		},
	],
	integration_types: [0],
	contexts: [0],
};

/**
 * @param { object } command - object command
 * @param { import("discord.js").CommandInteraction } command.interaction - interaction
 * @param { import('../../lang/vi.js') } command.lang - language
 */
module.exports.execute = async ({ interaction, lang }) => {
	try {
		const commandtype = interaction.options?.getSubcommand();
		const query = interaction.options?.getString("query");
		const command = useFunctions().get("Search");

		if (!query) {
			return interaction.reply({ content: lang.music.NOres, ephemeral: true });
		}

		switch (commandtype) {
			case "next": {
				const queue = useQueue(interaction.guild.id);

				if (queue) {
					const res = await player.search(query, {
						searchEngine: config.PlayerConfig.QueryType,
					});
					const track = res.tracks?.[0];

					if (track) {
						queue.insertTrack(track, 0);
						return interaction.reply({ content: lang.music.Next, ephemeral: true });
					} else {
						return interaction.reply({ content: lang.music.NOres, ephemeral: true });
					}
				} else {
					await command.execute(interaction, query, lang);
				}
				break;
			}

			case "assistant": {
				const focus = interaction.options.getBoolean("focus") ? interaction.user.id : null;
				await command.execute(interaction, query, lang, { assistant: true, focus });
				break;
			}

			default:
				await command.execute(interaction, query, lang);
		}
	} catch (error) {
		console.error("Lỗi khi thực thi lệnh play:", error);
		await interaction.reply({ content: "❌ Đã xảy ra lỗi khi thực hiện lệnh.", ephemeral: true }).catch(() => {});
	}
};

/**
 * @param { object } autocomplete - object autocomplete
 * @param { import("discord.js").AutocompleteInteraction } autocomplete.interaction - interaction
 * @param { import('../../lang/vi.js') } autocomplete.lang - language
 */
module.exports.autocomplete = async ({ interaction, lang }) => {
	try {
		const query = interaction.options.getString("query", true);
		if (!query || query.length < 2) return; // Giới hạn độ dài để tránh spam

		const results = await player.search(query, {
			fallbackSearchEngine: QueryType.SOUNDCLOUD,
			searchEngine: config.PlayerConfig.QueryType,
		});

		const tracks = results.tracks
			.filter((t) => t.title.length > 0 && t.title.length < 100 && t.url.length > 0 && t.url.length < 100)
			.slice(0, 10);

		if (tracks.length === 0) return;

		await interaction.respond(
			tracks.map((t) => ({ name: `${t.author} - ${t.title}`, value: t.url }))
		);
	} catch (error) {
		console.error("Lỗi khi xử lý autocomplete:", error);
	}
};
