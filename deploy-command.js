// require('dotenv').config();

const path = require('path');
const fs = require('fs');

const { REST, Routes } = require('discord.js');

const clientId = process.env.APP_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then((data) =>
    console.log(`successfully registered ${data.length} application commands.`)
  )
  .catch((err) => console.log(err));
