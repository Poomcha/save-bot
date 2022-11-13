const fs = require('fs');
const path = require('path');
require('dotenv').config();

const {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} = require('discord.js');

const token = process.env.TOKEN;
const appId = process.env.APP_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const rest = new REST({ version: '10' }).setToken(token);

// Association des commandes du bot au client.
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandsFiles = fs
  .readdirSync(commandsPath)
  .filter((f) => f.endsWith('.js'));

for (const file of commandsFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Réaction du bot à une intéraction.
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  const commandName = interaction.commandName;

  if (commandName === 'start') client.emit('alert', interaction);
  else if (commandName === 'stop') client.emit('sleep', interaction);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: '🤖 an error occurs while executing /' + interaction.commandName,
      ephemeral: true,
    });
  }
});

const { getRandom, parseTimingChoice } = require('./utils.js');
const intervalConfig = {
  intervalDefault: 1000 * 60 * 30,
  message: async (interaction) => {
    if (interaction?.options.getBoolean('random')) {
      const guild = await client.guilds.fetch(interaction.guildId);
      const guildMembers = await guild.members.fetch();
      const membersName = guildMembers
        .map((member) => member.user.username)
        .filter((name) => name !== 'ctrl+s');
      const luckyOne = membersName[getRandom(0, membersName.length)];
      try {
        return `🤖 @${luckyOne} save!`;
      } catch (err) {
        console.log(err);
        return `🤖 @everyone save!`;
      }
    } else {
      return `🤖 @everyone save!`;
    }
  },
};
// Réaction aux events 'alert' et 'sleep' déclenchés par les commandes d'intéractions.
client.on('alert', async (interaction) => {
  const intervalChoice =
    parseTimingChoice(interaction?.options.getString('interval')) ??
    intervalConfig.intervalDefault;
  const alert = setInterval(
    async () =>
      client.channels
        .fetch(interaction.channelId)
        .then(async (channel) =>
          channel.send(await intervalConfig.message(interaction))
        )
        .catch((err) => console.log(err)),
    intervalChoice
  );
  client.on('sleep', async () => {
    clearInterval(alert);
  });
});

// Création dynamique des commandes à l'intégration du bot par un nouveau serveur.
client.on('guildCreate', async () => {
  const guildIds = client.guilds.cache.map((guild) => guild.id);
  const commands = [];
  for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
  }
  guildIds.forEach((guildId) => {
    rest
      .put(Routes.applicationGuildCommands(appId, guildId), { body: commands })
      .then((data) =>
        console.log(
          `successfully registered ${data.length} application commands.`
        )
      )
      .catch((err) => console.log(err));
  });
});

client.login(token);
