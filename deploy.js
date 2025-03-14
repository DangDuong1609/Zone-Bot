const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require("dotenv").config();

module.exports = async (client) => {
    const commands = [];
    // Grab all the command folders from the commands directory you created earlier
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        // Grab all the command files from the commands directory you created earlier
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

    // and deploy your commands!
    try {
        // console.log(`Started refreshing ${commands.length} application [/] commands.`);

        const data = await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        // console.log(`Successfully reloaded ${data.length} application [/] commands.`);
        return data;
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
}