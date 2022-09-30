const fs = require('fs');
const path = require('path');

const { Client, Collection, GatewayIntentBits } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID;

// Create new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  const commandName = interaction.commandName;

  if (commandName === 'start') client.emit('alert');
  else if (commandName === 'stop') client.emit('sleep');

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'error occurs while executing this command.',
      ephemeral: true,
    });
  }
});

const intervalConfig = { interval: 1000*60*30, message: 'SAAAAAVE!' };

client.on('alert', async () => {
  const alert = setInterval(
    async () =>
      client.channels
        .fetch(guildId)
        .then((channel) => channel.send(intervalConfig.message))
        .catch((err) => console.log(err)),
    intervalConfig.interval
  );
  client.on('sleep', async () => {
    clearInterval(alert);
  });
});

// Login to Discord with your client's token
client.login(token);
