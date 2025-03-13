const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require("node:fs");
const path = require('node:path');
const { Player } = require('discord-player');
const { DefaultExtractors } = require("@discord-player/extractor");
const { YoutubeiExtractor } = require("discord-player-youtubei");
const ffmpeg = require('ffmpeg-static');
process.env.FFMPEG_PATH = ffmpeg;

require("dotenv").config();

// Creating the Discord.js Client for This Bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// ✅ Initialize Player first
const player = new Player(client);
player.setMaxListeners(100);

(async () => {
    await player.extractors.loadMulti(DefaultExtractors);
    if (YoutubeiExtractor) {
        console.log("Registering YoutubeiExtractor...");
        await player.extractors.register(YoutubeiExtractor, {});
        console.log("YoutubeiExtractor registered.");
    } else {
        console.error("YoutubeiExtractor is undefined!");
    }
})();


client.once(Events.ClientReady, async readyClient => {
    await require('./deploy')(readyClient);
});

// Client variables
client.commands = new Collection();
client.functions = new Collection();

//Loading files, with the client variable like Command Handler, Event Handler, ...
// ["command", "events"].forEach(handler => {
//     require(`./handlers/${handler}`)(client);
// });

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const commandfilePath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(commandfilePath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandfilePath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Load functions
const functionsPath = path.join(__dirname, 'functions');
const functionsFolders = fs.readdirSync(functionsPath);

for (const folder of functionsFolders) {
    const functionsfilePath = path.join(functionsPath, folder);
    const functionFiles = fs.readdirSync(functionsfilePath).filter(file => file.endsWith('.js'));
    for (const file of functionFiles) {
        const filePath = path.join(functionsfilePath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.functions.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The function at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Interaction handling
client.on(Events.InteractionCreate, async interaction => {
    try {
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            if (typeof command.autocomplete !== 'function') {
                console.error(`Command ${interaction.commandName} does not have a valid autocomplete function.`);
                return;
            }
            await command.autocomplete(interaction);
            return;
        }

        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    try {
        const event = require(filePath);
        client.on(event.name, (...args) => event.execute(...args));
    } catch (error) {
        console.error(`Error loading event ${file}:`, error);
    }
}

// Load player events
const playerEventsPath = path.join(__dirname, 'player');
const playerEventFiles = fs.readdirSync(playerEventsPath).filter(file => file.endsWith('.js'));
for (const file of playerEventFiles) {
    const playerPath = path.join(playerEventsPath, file);
    try {
        const event = require(playerPath);
        player.events.on(event.name, (...args) => event.execute(client, ...args));
    } catch (error) {
        console.error(`Error loading player event ${file}:`, error);
    }
}

// Login into the bot
client.login(process.env.DISCORD_BOT_TOKEN);