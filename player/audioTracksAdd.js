const config = require('../config');

module.exports = {
	name: 'audioTracksAdd',
	execute: (queue, track) => {
		// // Check if metadata and channel are defined
		// if (!track.metadata?.channel) {
		// 	console.error('Metadata or channel is undefined:', track.metadata);
		// 	return;
		// }

		// // Ensure all fields have valid values
		// const duration = track.metadata.duration || 'Không xác định'; // Fallback for undefined duration
		// const requestedBy = track.metadata.requestedBy?.toString() || 'Ẩn danh'; // Fallback for undefined requester

		// // Send the embed to the channel
		// track.metadata.channel.send({
		// 	embeds: [{
		// 		color: 0x3d8f58,
		// 		title: '🎵 Đã thêm vào hàng đợi',
		// 		description: `**[${track.metadata.title}](${track.metadata.url})**`,
		// 		thumbnail: {
		// 			url: track.metadata.thumbnail
		// 		},
		// 		fields: [
		// 			{
		// 				name: '⏳ Thời lượng',
		// 				value: duration, // Use the fallback value
		// 				inline: true
		// 			},
		// 			{
		// 				name: '📤 Yêu cầu bởi',
		// 				value: requestedBy, // Use the fallback value
		// 				inline: true
		// 			}
		// 		],
		// 		footer: {
		// 			text: `Yêu cầu bởi ${track.metadata.requestedBy?.username || "Ẩn danh"}`,
		// 			iconURL: track.metadata.requestedBy?.displayAvatarURL({ size: 1024 })
		// 		}
		// 	}]
		// });

		// const embed = new EmbedBuilder()
		//     .setDescription(`Đã thêm bài hát: ${track.title}`)
		// 	.setColor('Random')
		//     .setFooter({ text: `Yêu cầu bởi ${track.metadata.requestedBy.username}`, iconURL: track.metadata.requestedBy.displayAvatarURL({ size: 1024 }) })
		//     .setTimestamp()
		//     .setThumbnail(track.thumbnail)
		// 	.setTitle('Đã thêm bài hát')
		// 	.addFields([
		// 		{ name: 'Tên', value: track.title },
		// 		{ name: 'Thời lượng', value: track.duration },
		// 		{ name: 'Yêu cầu', value: track.requester }
		// 	]);
		// await queue.metadata.channel.send({ embeds: [embed] });
	},
};