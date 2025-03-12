const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require("node:fs");
const path = require('node:path');
const { Player } = require('discord-player');
const { YouTubeExtractor, SoundCloudExtractor, DefaultExtractors } = require("@discord-player/extractor");
const ffmpeg = require('ffmpeg-static');
process.env.FFMPEG_PATH = ffmpeg;

require("dotenv").config();

//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
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
    console.log("Loading default extractors...");
    await player.extractors.loadMulti(DefaultExtractors);
    console.log("Default extractors loaded.");

    if (YouTubeExtractor) {
        console.log("Registering YouTubeExtractor...");
        await player.extractors.register(YouTubeExtractor);
        console.log("YouTubeExtractor registered.");
    } else {
        console.error("YouTubeExtractor is undefined!");
    }

    if (SoundCloudExtractor) {
        console.log("Registering SoundCloudExtractor...");
        await player.extractors.register(SoundCloudExtractor);
        console.log("SoundCloudExtractor registered.");
    } else {
        console.error("SoundCloudExtractor is undefined!");
    }
})();


client.once(Events.ClientReady, async readyClient => {
	const deploy = await require('./deploy')(readyClient);
    // console.log(deploy);
})

//Client variables to use everywhere
client.categories = fs.readdirSync("./commands/");
client.commands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();

client.functions = new Collection();

//Loading files, with the client variable like Command Handler, Event Handler, ...
["command", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
	const commandPath = path.join(commandsPath, folder);
	const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const functionsPath = path.join(__dirname, 'functions');
const functionsFolders = fs.readdirSync(functionsPath);

for (const folder of functionsFolders) {
	const functionPath = path.join(functionsPath, folder);
	const functionFiles = fs.readdirSync(functionPath).filter(file => file.endsWith('.js'));
	for (const file of functionFiles) {
		const filePath = path.join(functionPath, file);
		const functions = require(filePath);
		// Set a new item in the Collection with the key as the function name and the value as the exported module
		if ('name' in functions && 'execute' in functions) {
			client.functions.set(functions.name, functions);
		} else {
			console.log(`[WARNING] The function at ${filePath} is missing a required "name" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	// const event = await import(pathToFileURL(filePath.replace(/\\/g, '/')));
	const event = require(filePath);
	client.on(event.name, (...args) => event.execute(...args));
}

const playerEventsPath = path.join(__dirname, 'player');
const playerEventFiles = fs.readdirSync(playerEventsPath).filter(file => file.endsWith('.js'));

for (const file of playerEventFiles) {
	const playerPath = path.join(playerEventsPath, file);
	// const event = await import(pathToFileURL(filePath.replace(/\\/g, '/')));
	const event = require(playerPath);
	player.events.on(event.name, (...args) => event.execute(client, ...args));
}

//login into the bot
// client.login(require("./botconfig/config.json").token);
client.login(process.env.DISCORD_BOT_TOKEN);

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
