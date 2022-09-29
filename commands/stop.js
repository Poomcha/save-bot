const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('stop the ctrl+s bot.'),
  async execute(interaction) {
    interaction.reply('ctrl+s bot stopped!');
  },
};
