const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('start the ctrl+s bot.'),
  async execute(interaction) {
    interaction.reply('ctrl+s bot started!');
  },
};
