const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Returns all commands, or detailed information about a specific command')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The name of the command you want help with')
                .setRequired(false)),

    async execute(interaction) {
        const commandName = interaction.options.getString('command');
        const { client } = interaction;

        if (commandName) {
            // Fetch command details
            const command = client.commands.get(commandName);
            if (!command) {
                return interaction.reply({ content: `❌ No information found for command **${commandName}**`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(0x00AE86)
                .setTitle(`Help: \`${command.data.name}\``)
                .addFields(
                    { name: "**Description**", value: command.data.description },
                    { name: "**Usage**", value: `/${command.data.name}` }
                )
                .setFooter({ text: "Syntax: <> = required, [] = optional" });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            // General help menu
            const embed = new EmbedBuilder()
                .setColor(0x00AE86)
                .setTitle("📜 Help Menu")
                .setDescription("Here is a list of all available commands:")
                .setFooter({ text: "Use /help [command] to get details about a specific command" });

            client.commands.forEach(cmd => {
                embed.addFields({ name: `/${cmd.data.name}`, value: cmd.data.description, inline: true });
            });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
